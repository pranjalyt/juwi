import ssl
#mac compatibility
ssl._create_default_https_context = ssl._create_unverified_context
import requests
import fitz  # This is PyMuPDF for reading slides
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import base64
from io import BytesIO
from PIL import Image
from openai import OpenAI
import os
import tempfile
import whisper




#for grading of phase 1
from typing import List
from pydantic import BaseModel
from vector_scorer import VectorUniquenessScorer
from github_scorer import GitHubDensityScorer
from llm_grader import LLMArchitectureGrader
from fact_checker import LiveFactChecker


# --- INITIALIZE THE 3 BRICKS ---
print("Waking up the Juwi Judging Engine...")
vector_scorer = VectorUniquenessScorer()
github_scorer = GitHubDensityScorer()
llm_grader = LLMArchitectureGrader()

print("Loading Fact Checker...")
fact_checker = LiveFactChecker()

print("Judging Engine Ready!")


# --- CREATE THE DATA MODELS ---
class ProjectSubmission(BaseModel):
    id: str
    name: str
    description: str
    github_url: str

class BatchSubmissions(BaseModel):
    projects: List[ProjectSubmission]






app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows any local port to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
client = OpenAI(
    base_url="http://localhost:1234/v1",
    api_key="lm-studio"
)

print("Loading Whisper model... this takes a few seconds.")
whisper_model = whisper.load_model("base")
print("Whisper ready!")


# cloud_client = OpenAI(
#     base_url="https://openrouter.ai/api/v1",
#     api_key="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", 
# )

# --- Existing Routes ---
@app.get("/")
async def root():
    return {"status": "online"}

class TranscriptData(BaseModel):
    transcript_chunk: str

@app.post("/extract-tech-stack")
async def extract_tech_stack(data: TranscriptData):
    # (Your existing working code here)
    try:
        # The prompt forces the local Qwen model to output clean bullet points
        system_prompt = "You are a technical extractor. Read the transcript and list the programming languages, frameworks, or cloud tools mentioned. Output ONLY a comma-separated list."
        
        response = client.chat.completions.create(
            model="local-model", # LM studio ignores this, it uses whatever is loaded
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": data.transcript_chunk}
            ],
            temperature=0.1, # Keep it low so it doesn't hallucinate
        )
        
        extracted_tech = response.choices[0].message.content
        return {"status": "success", "tech_stack": extracted_tech}

    except Exception as e:
        # BULLETPROOFING: If the AI crashes, the app doesn't die. 
        # It just returns a safe fallback message.
        return {"status": "error", "tech_stack": "Processing error, please try again."}


# --- NEW: GitHub Analyzer Route ---

class RepoData(BaseModel):
    github_url: str

@app.post("/analyze-repo")
async def analyze_repo(data: RepoData):
    try:
        url_parts = data.github_url.rstrip("/").split("/")
        owner, repo = url_parts[-2], url_parts[-1]
        
        # We will try 'main' branch first. (In a production app, you'd check both main and master)
        base_raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/main"
        
        repo_context = f"Analyzing Repository: {owner}/{repo}\n\n"
        
        # TARGET 1: The Documentation (Truth Claims)
        readme_res = requests.get(f"{base_raw_url}/README.md")
        if readme_res.status_code == 200:
            repo_context += "--- README (CLAIMS) ---\n"
            repo_context += readme_res.text[:1500] + "\n\n"
        else:
            repo_context += "--- ⚠️ PENALTY FLAG: NO README FOUND ---\n\n"

        # TARGET 2: The Dependencies (The Bricks)
        for req_file in ["package.json", "requirements.txt"]:
            req_res = requests.get(f"{base_raw_url}/{req_file}")
            if req_res.status_code == 200:
                repo_context += f"--- {req_file.upper()} (DEPENDENCIES) ---\n"
                repo_context += req_res.text[:1000] + "\n\n"

        # TARGET 3: Architecture & Entry Points (The Blueprint)
        # We hunt for common files that reveal the real system design
        core_files = ["docker-compose.yml", "app.py", "main.py", "server.js", "index.js"]
        for file in core_files:
            file_res = requests.get(f"{base_raw_url}/{file}")
            if file_res.status_code == 200:
                repo_context += f"--- {file.upper()} (ACTUAL CODE) ---\n"
                # We only need the top 1000 chars to see imports, DB connections, and server setup
                repo_context += file_res.text[:1000] + "\n\n"

        system_prompt = """You are a ruthless Technical Architect judging a hackathon. 
        Read the provided repository snippets.
        1. List the ACTUAL tech stack, databases, and frameworks found in the code/dependencies.
        2. Identify the system architecture (e.g., Monolith, Microservices, simple API wrapper, etc.) based on the entry points.
        3. Flag any major discrepancies (e.g., the README claims a complex ML pipeline, but the code is just a basic Flask UI).
        Keep the output concise, structured, and bulleted."""

        response = client.chat.completions.create(
            model="local-model",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": repo_context}
            ],
            temperature=0.1,
        )
        
        return {
            "status": "success", 
            "repo_analysis": response.choices[0].message.content
        }

    except Exception as e:
        print(f"--- ERROR IN ANALYZE REPO --- \n {str(e)}")
        return {"status": "error", "message": str(e)}


@app.post("/analyze-slides")
async def analyze_slides(file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()
        pdf_document = fitz.open(stream=file_bytes, filetype="pdf")
        
        slide_text = ""
        # Process up to 15 slides
        num_pages = min(len(pdf_document), 15)
        
        for page_num in range(num_pages):
            page = pdf_document.load_page(page_num)
            raw_text = page.get_text("text").strip()
            
            # Only append if the slide actually has text
            if raw_text:
                slide_text += f"--- Slide {page_num + 1} ---\n"
                slide_text += raw_text + "\n\n"
            
        pdf_document.close()

        if len(slide_text) < 50:
             return {
                 "status": "warning", 
                 "message": "Insufficient text found. This may be an image-only deck."
             }

        system_prompt = """You are a VC Judge reviewing a startup's pitch deck text. 
        Extract and summarize the following in a highly concise format:
        1. Core Problem: What are they trying to solve?
        2. Proposed Solution: How does their product work?
        3. Architecture Claims: Did they mention any specific cloud tools, databases, or AI models in the text?
        Do not make up information. If something is missing, state 'Not mentioned'."""

        response = client.chat.completions.create(
            model="local-model",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Slide Text:\n{slide_text}"}
            ],
            temperature=0.1,
        )

        return {
            "status": "success",
            "slide_analysis": response.choices[0].message.content
        }

    except Exception as e:
        print(f"--- ERROR IN ANALYZE SLIDES --- \n {str(e)}")
        return {"status": "error", "message": str(e)}




#audio Processing
@app.post("/process-audio")
async def process_audio(file: UploadFile = File(...)):
    try:
        # 1. Save and transcribe the audio chunk
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
            temp_audio.write(await file.read())
            temp_audio_path = temp_audio.name

        print("Transcribing chunk...")
        result = whisper_model.transcribe(temp_audio_path, fp16=False)
        transcript_text = result["text"].strip()
        os.remove(temp_audio_path)

        if not transcript_text:
            return {"status": "warning", "message": "No speech detected."}

        print(f"Heard: {transcript_text}")

        # 2. The Segregation Prompt
        system_prompt = """You are a live fact-checking assistant for technical judges. 
        Read this live speech-to-text transcript from a startup pitch.
        Extract two things:
        1. "tech_stack": A list of any programming languages, frameworks, or hardware mentioned.
        2. "claims": A list of bold statements, performance metrics, or unique value propositions (e.g., "We process 10k transactions a second", "It operates at 99% accuracy", "We are the first to do X").

        If a category has no items, output an empty list [].
        Output ONLY valid JSON in this exact format:
        {
            "tech_stack": ["tool1", "tool2"],
            "claims": ["claim1", "claim2"]
        }"""

        # 3. Ask Qwen to segregate the data
        response = client.chat.completions.create(
            model="local-model",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": transcript_text}
            ],
            temperature=0.1
        )

        # 4. Parse the JSON safely
        result_text = response.choices[0].message.content
        import json
        try:
            extracted_data = json.loads(result_text)
        except json.JSONDecodeError:
            # Failsafe if Qwen messes up the JSON formatting
            extracted_data = {"tech_stack": [], "claims": []}

        print(f"Extracted: {extracted_data}")

        # ---  LIVE FACT-CHECKING LOOP ---
        raw_claims = extracted_data.get("claims", [])
        verified_claims = []
        
        if raw_claims:
            print(f"Fact-checking {len(raw_claims)} claims live...")
            for claim in raw_claims:
                # Pass each claim to our DuckDuckGo module
                verification = fact_checker.check_claim(claim)
                
                # Bundle the original claim with Qwen's verdict
                verified_claims.append({
                    "claim": claim,
                    "verdict": verification.get("verdict", "UNVERIFIED"),
                    "explanation": verification.get("explanation", "No explanation generated.")
                })

        return {
            "status": "success", 
            "transcript": transcript_text,
            "tech_stack": extracted_data.get("tech_stack", []),
            "verified_claims": verified_claims # Send the rich data to the frontend
        }

    except Exception as e:
        print(f"ERROR: {str(e)}")
        return {"status": "error", "message": str(e)}



#phase 1 grading combined file of 3 stages
# --- THE MASTER 100-POINT JUDGING ROUTE ---
@app.post("/rank-projects")
async def rank_projects(payload: BatchSubmissions):
    try:
        projects = payload.projects
        leaderboard = []

        # STAGE 1: Vector Uniqueness (Batch Process)
        # We send all descriptions at once to find the clones
        vector_inputs = [{"id": p.id, "description": p.description} for p in projects]
        uniqueness_results = vector_scorer.score_uniqueness(vector_inputs)
        
        # Create a quick dictionary to look up scores easily: {"Team_A": 20.0}
        uniqueness_map = {res["project_id"]: res["uniqueness_score"] for res in uniqueness_results}

        # STAGE 2 & 3: GitHub Density & LLM Grading
        for proj in projects:
            print(f"\nEvaluating: {proj.name}...")
            
            # Brick 2: GitHub Density (Max 40)
            gh_result = github_scorer.score_repository(proj.github_url)
            gh_score = gh_result.get("total_density_score", 0)
            gh_facts = gh_result.get("breakdown", {})

            # Brick 3: LLM Architecture Grade (Max 40)
            llm_result = llm_grader.grade_project(proj.name, proj.description, gh_facts)
            llm_score = llm_result.get("llm_score", 0)
            justification = llm_result.get("justification", "No justification.")

            # Calculate Final Juwi Power Score (Max 100)
            uq_score = uniqueness_map.get(proj.id, 0)
            total_score = uq_score + gh_score + llm_score

            leaderboard.append({
                "id": proj.id,
                "name": proj.name,
                "total_score": round(total_score, 1),
                "breakdown": {
                    "uniqueness_score": uq_score,
                    "github_density_score": gh_score,
                    "llm_architecture_score": llm_score
                },
                "llm_justification": justification
            })

        # SORT THE LEADERBOARD: Highest score wins!
        leaderboard.sort(key=lambda x: x["total_score"], reverse=True)

        return {
            "status": "success", 
            "total_evaluated": len(projects),
            "leaderboard": leaderboard
        }

    except Exception as e:
        print(f"PIPELINE ERROR: {str(e)}")
        return {"status": "error", "message": str(e)}