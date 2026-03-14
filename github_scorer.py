import requests
from typing import Dict, Any

class GitHubDensityScorer:
    def __init__(self):
        # We use the GitHub Trees API to get the entire folder structure instantly
        self.base_url = "https://api.github.com/repos"

    def parse_url(self, github_url: str) -> tuple:
        """Extracts owner and repo name from the URL."""
        parts = github_url.rstrip("/").split("/")
        return parts[-2], parts[-1]

    def score_repository(self, github_url: str) -> Dict[str, Any]:
        try:
            owner, repo = self.parse_url(github_url)
            
            # Fetch the entire repository file tree in one single API call
            # We try 'main' first, fallback to 'master' if it fails
            tree_url = f"{self.base_url}/{owner}/{repo}/git/trees/main?recursive=1"
            response = requests.get(tree_url)
            
            if response.status_code != 200:
                tree_url = f"{self.base_url}/{owner}/{repo}/git/trees/master?recursive=1"
                response = requests.get(tree_url)
                
            if response.status_code != 200:
                return {"error": "Could not fetch repo tree. Is it public?", "score": 0}

            files = response.json().get("tree", [])
            
            return self._calculate_heuristics(files)

        except Exception as e:
            return {"error": str(e), "score": 0}

    def _calculate_heuristics(self, files: list) -> Dict[str, Any]:
        score = 0
        details = {
            "high_value_files": 0,
            "domains_detected": {
                "web_cloud": False,
                "data_science_ml": False,
                "mobile_app": False,
                "hardware_iot": False,
                "web3_blockchain": False,
                "game_dev": False
            },
            "has_ci_cd": False
        }

        # Expanded to include Mobile, Hardware, Web3, and Game Dev languages
        core_extensions = (
            '.py', '.ts', '.js', '.rs', '.go', '.java', '.cpp', '.cs', 
            '.swift', '.kt', '.dart', '.sol', '.c', '.ino'
        )
        
        for file in files:
            path = file['path'].lower()
            
            # Skip auto-generated junk
            if any(junk in path for junk in ['node_modules', 'venv', '.git', '.next', '__pycache__']):
                continue

            # 1. Count Core Logic
            if path.endswith(core_extensions):
                details["high_value_files"] += 1

            # 2. Detect Web / Cloud / DB Infrastructure
            if any(x in path for x in ['docker', 'kubernetes', 'prisma', 'alembic', 'schema.sql']):
                details["domains_detected"]["web_cloud"] = True
                
            # 3. Detect Data Science / Machine Learning
            if any(x in path for x in ['.ipynb', 'train.py', 'model.pt', 'weights.h5', 'sagemaker']):
                details["domains_detected"]["data_science_ml"] = True
                
            # 4. Detect Mobile App Native Configs (Flutter, React Native, iOS, Android)
            if any(x in path for x in ['pubspec.yaml', 'build.gradle', 'podfile', 'androidmanifest.xml']):
                details["domains_detected"]["mobile_app"] = True
                
            # 5. Detect Hardware / IoT (Arduino, PlatformIO, C++)
            if any(x in path for x in ['.ino', 'platformio.ini', 'cmakelists.txt']):
                details["domains_detected"]["hardware_iot"] = True
                
            # 6. Detect Web3 / Blockchain / Smart Contracts
            if any(x in path for x in ['.sol', 'hardhat.config', 'truffle', 'anchor.toml']):
                details["domains_detected"]["web3_blockchain"] = True
                
            # 7. Detect Game Development (Unity, Godot)
            if any(x in path for x in ['.unity', '.tscn', 'projectsettings']):
                details["domains_detected"]["game_dev"] = True

            # 8. CI/CD Pipelines
            if '.github/workflows' in path or '.gitlab-ci.yml' in path:
                details["has_ci_cd"] = True

        # --- CALCULATE DYNAMIC SCORE (Max 40) ---
        
        # Base Points: Up to 20 points for sheer volume of code
        score += min(details["high_value_files"], 20)
        
        # Domain Points: 
        domain_count = sum(1 for v in details["domains_detected"].values() if v)
        
        if domain_count > 0:
            score += 10 # They hit at least one major architectural milestone for their niche
        
        if domain_count > 1:
            score += 5  # Bonus points for Cross-Domain! (e.g., A mobile app that also has a custom ML model)
            
        # Enterprise Points
        if details["has_ci_cd"]: 
            score += 5

        return {
            "total_density_score": min(score, 40),  # Hard cap at 40 just in case
            "breakdown": details
        }

# --- TEST THE MODULE LOCALLY ---
if __name__ == "__main__":
    scorer = GitHubDensityScorer()
    
    print("Testing a basic repo...")
    # Change this URL to one of your own repos, or any public repo!
    user_inpt = input("Enter GitHub URL: ")
    test_url = user_inpt 
    
    result = scorer.score_repository(test_url)
    print("\n--- RESULTS ---")
    print(f"Total Score (out of 40): {result.get('total_density_score')}")
    print(f"Breakdown: {result.get('breakdown')}")