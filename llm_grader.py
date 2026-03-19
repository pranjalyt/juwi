import os
from dotenv import load_dotenv
load_dotenv()
import json
import os
from openai import OpenAI
from typing import Dict, Any

class LLMArchitectureGrader:
    def __init__(self):
        # Connect to your local LM Studio instance running Qwen
        self.client = OpenAI(
            base_url=os.environ.get("LLM_BASE_URL", "http://localhost:1234/v1"),
            api_key="lm-studio"
        )

    def grade_project(self, project_name: str, abstract: str, github_facts: dict) -> Dict[str, Any]:
        """
        Feeds the abstract and verified code metrics to the LLM to get a score out of 40.
        """
        # We format the verified facts into a dense, token-efficient string
        fact_sheet = f"""
        PROJECT NAME: {project_name}
        PITCH ABSTRACT: {abstract}
        
        VERIFIED GITHUB FACTS:
        - Core Logic Files: {github_facts.get('high_value_files', 0)}
        - Has Backend Infrastructure (Docker/K8s): {github_facts.get('has_backend_infra', False)}
        - Has Database Configuration: {github_facts.get('has_database_config', False)}
        - Has CI/CD Pipeline: {github_facts.get('has_enterprise_ci_cd', False)}
        """

        system_prompt = """You are a Cloud Architect scoring a hackathon project.
Score the technical architecture from 0 to 40. Use the exact number that fits — do NOT round to multiples of 5 or 10.

SCORING SIGNALS (combine these to find the exact score):
- Static/no backend: 0-8
- Basic CRUD or simple API wrapper: 9-18  
- Custom logic + real DB + auth: 19-28
- Advanced infra, ML pipeline, or large codebase: 29-40

ADJUST the score up or down by 1-5 points based on:
- Code quality and repo size (+/- points)
- Number of integrations (+1 per meaningful one)
- Complexity of the problem being solved (+/- points)

Your score MUST reflect these adjustments. Never output a multiple of 5.

Output ONLY this JSON, no markdown:
{"architecture_score": 0, "justification": "2 sentences max."}"""

        try:
            response = self.client.chat.completions.create(
                model="local-model",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": fact_sheet}
                ],
                temperature=0.1, # Keep it highly deterministic
                # response_format={"type": "json_object"} # Force the model to output valid JSON
            )

            # Parse the JSON string returned by the LLM into a Python dictionary
            result_text = response.choices[0].message.content
            grade_data = json.loads(result_text)
            
            # Failsafe: Ensure the score stays within bounds
            score = min(max(int(grade_data.get("architecture_score", 0)), 0), 40)

            return {
                "llm_score": score,
                "justification": grade_data.get("justification", "No justification provided.")
            }

        except Exception as e:
            print(f"LLM Grading Error: {e}")
            return {"llm_score": 0, "justification": "Failed to generate LLM grade due to an error."}

# --- TEST THE MODULE LOCALLY ---
if __name__ == "__main__":
    grader = LLMArchitectureGrader()
    
    # Let's simulate the data we got from Team D (The God-Tier IoT Project)
    simulated_abstract = "A decentralized IoT mesh network using LoRaWAN to track soil moisture for rural farmers."
    simulated_github_facts = {
        'high_value_files': 42, 
        'has_backend_infra': True, 
        'has_database_config': True, 
        'has_enterprise_ci_cd': False
    }
    
    print("Sending Fact Sheet to local Qwen model...")
    result = grader.grade_project("FarmMesh", simulated_abstract, simulated_github_facts)
    
    print("\n--- LLM GRADING RESULTS ---")
    print(f"Architecture Score: {result['llm_score']} / 40")
    print(f"Justification: {result['justification']}")