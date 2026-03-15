import json
import requests
from ddgs import DDGS
from openai import OpenAI
from typing import Dict, Optional

class LiveFactChecker:
    def __init__(self):
        self.client = OpenAI(
            base_url="http://localhost:1234/v1",
            api_key="lm-studio"
        )

    def route_claim(self, claim: str) -> str:
        """The 'Brain'. Decides if we need to search Google or search their GitHub."""
        system_prompt = """You are a routing agent. You must output exactly one word: WEB or CODE.
        
        Examples:
        Claim: "Python executes faster than C++." => WEB
        Claim: "We built our own custom compiler." => CODE
        Claim: "Stripe charges a 5% transaction fee." => WEB
        Claim: "Our backend is connected to MongoDB." => CODE
        Claim: "React was created by Microsoft." => WEB
        """
        
        try:
            response = self.client.chat.completions.create(
                model="local-model",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Claim: {claim}"}
                ],
                temperature=0.0
            )
            decision = response.choices[0].message.content.strip().upper()
            
            # If Qwen even mentions WEB, route it to the internet
            if "WEB" in decision:
                return "WEB"
            return "CODE"
        except:
            return "WEB" # Default to web if the router fails

    def check_web(self, claim: str) -> Dict[str, str]:
        print(f"   🌐 Routing to Web Search...")
        try:
            with DDGS() as ddgs:
                results = list(ddgs.text(claim, max_results=3))
            
            if not results:
                return {"verdict": "UNVERIFIED", "explanation": "No web results found."}

            search_context = "\n".join([f"- {res['body']}" for res in results])

            system_prompt = """You are a ruthless technical fact-checker. Compare the claim against the web search results.
            Classify as TRUE, FALSE, or EXAGGERATED. Output ONLY JSON: {"verdict": "FALSE", "explanation": "Your 1-sentence interrogation prompt for the judge."}"""

            response = self.client.chat.completions.create(
                model="local-model",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"CLAIM: {claim}\n\nWEB RESULTS:\n{search_context}"}
                ],
                temperature=0.1
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            return {"verdict": "ERROR", "explanation": "Web search failed."}

    def check_codebase(self, claim: str, github_url: str) -> Dict[str, str]:
        print(f"   💻 Routing to GitHub Codebase Scanner...")
        if not github_url:
            return {"verdict": "UNVERIFIED", "explanation": "Claim requires code verification, but no GitHub URL was provided."}

        try:
            url_parts = github_url.rstrip("/").split("/")
            owner, repo = url_parts[-2], url_parts[-1]
            base_raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/main"
            
            repo_context = "GITHUB REPO SNIPPETS:\n"
            
            for file in ["README.md", "package.json", "requirements.txt", "main.py", "app.py"]:
                res = requests.get(f"{base_raw_url}/{file}")
                if res.status_code == 200:
                    repo_context += f"--- {file} ---\n{res.text[:2100]}\n\n"

            system_prompt = """You are a Senior Code Auditor. The student made a bold claim about what they built. 
            Check the provided GitHub repository snippets to see if there is ANY evidence that they actually built it.
            Classify as TRUE, FALSE, or EXAGGERATED. Output ONLY valid JSON: {"verdict": "FALSE", "explanation": "Your 1-sentence interrogation prompt."}"""

            response = self.client.chat.completions.create(
                model="local-model",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"CLAIM: {claim}\n\n{repo_context}"}
                ],
                temperature=0.1
            )
            
            # THE FIX: Clean up any markdown backticks Qwen might have added
            result_text = response.choices[0].message.content.strip()
            if result_text.startswith("```json"):
                result_text = result_text.replace("```json", "").replace("```", "").strip()
            elif result_text.startswith("```"):
                result_text = result_text.replace("```", "").strip()

            return json.loads(result_text)

        except Exception as e:
             # Now it will actually tell us WHY it failed in the terminal!
             print(f"   ❌ Codebase Scan Error: {str(e)}")
             return {"verdict": "ERROR", "explanation": "Codebase scan failed."}

    def verify_claim(self, claim: str, github_url: Optional[str] = None) -> Dict[str, str]:
        print(f"\n🔍 Processing Claim: '{claim}'")
        
        # 1. The LLM Brain decides where to look
        route = self.route_claim(claim)
        
        # 2. Execute the correct search
        if route == "WEB":
            return self.check_web(claim)
        else:
            return self.check_codebase(claim, github_url)

# --- TEST THE AUTONOMOUS AGENT ---
if __name__ == "__main__":
    agent = LiveFactChecker()
    
    # Test 1: A general lie about technology
    print("--- TEST 1 ---")
    claim1 = "Python natively executes code 10x faster than C++."
    res1 = agent.verify_claim(claim1)
    print(res1)

    # Test 2: A lie about what they built (Using a basic frontend repo as an example)
    print("\n--- TEST 2 ---")
    claim2 = "We built our own custom Python machine learning compiler from scratch."
    res2 = agent.verify_claim(claim2, github_url="https://github.com/pranjalyt/autotantra")
    print(res2)






# import json
# from ddgs import DDGS #duckduckgo search
# from openai import OpenAI
# from typing import Dict

# class LiveFactChecker:
#     def __init__(self):
#         # Connect to your local Qwen model
#         self.client = OpenAI(
#             base_url="http://localhost:1234/v1",
#             api_key="lm-studio"
#         )

#     def check_claim(self, claim: str) -> Dict[str, str]:
#         print(f"\n🔍 Searching the web to verify: '{claim}'")
        
#         try:
#             # 1. Search DuckDuckGo (No API Key Required!)
#             with DDGS() as ddgs:
#                 # Grab the top 3 search results for the claim
#                 results = list(ddgs.text(claim, max_results=3))
            
#             if not results:
#                 return {"verdict": "UNVERIFIED", "explanation": "No web results found to confirm or deny."}

#             # 2. Format the search snippets for Qwen
#             search_context = "\n".join([f"- {res['body']}" for res in results])

#             # 3. Ask Qwen to act as the ruthless fact-checker
#             system_prompt = """You are a ruthless technical fact-checker for a hackathon judge. 
#             Compare the student's bold claim against the provided live search results.
#             Classify the claim as TRUE, FALSE, or EXAGGERATED.
#             Provide a 1-sentence explanation that the judge can use to interrogate the student.
            
#             Output ONLY valid JSON in this exact format:
#             {
#                 "verdict": "FALSE",
#                 "explanation": "Search results show C++ is faster, ask them if they mean development speed rather than execution speed."
#             }"""

#             prompt_content = f"STUDENT CLAIM: {claim}\n\nLIVE SEARCH RESULTS:\n{search_context}"

#             response = self.client.chat.completions.create(
#                 model="local-model",
#                 messages=[
#                     {"role": "system", "content": system_prompt},
#                     {"role": "user", "content": prompt_content}
#                 ],
#                 temperature=0.1
#             )

#             # 4. Parse Qwen's JSON verdict
#             result_text = response.choices[0].message.content
            
#             try:
#                 verdict_data = json.loads(result_text)
#             except json.JSONDecodeError:
#                  verdict_data = {"verdict": "ERROR", "explanation": "Failed to parse LLM judgment."}

#             return verdict_data

#         except Exception as e:
#             print(f"DuckDuckGo Search Error: {e}")
#             return {"verdict": "ERROR", "explanation": "Web search failed."}

# # --- TEST THE MODULE LOCALLY ---
# if __name__ == "__main__":
#     checker = LiveFactChecker()
    
#     # Let's test a common hackathon lie
#     test_claim = "Python is the fastest programming language for executing machine learning models compared to C++."
    
#     result = checker.check_claim(test_claim)
    
#     print("\n--- FACT CHECK RESULT ---")
#     print(f"Verdict: {result.get('verdict')}")
#     print(f"Interrogation Prompt: {result.get('explanation')}")