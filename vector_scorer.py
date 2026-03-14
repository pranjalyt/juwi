from sentence_transformers import SentenceTransformer, util
from typing import List, Dict

class VectorUniquenessScorer:
    def __init__(self):
        # We load a lightning-fast, small embedding model. 
        # It downloads once and stays in your Mac's RAM.
        print("Loading local embedding model... (Takes a few seconds the first time)")
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        print("Model loaded successfully!")

    def score_uniqueness(self, projects: List[Dict[str, str]]) -> List[Dict[str, float]]:
        """
        Takes a list of projects: [{"id": "1", "description": "An AI app..."}, ...]
        Returns a list of uniqueness scores (Max 20 points).
        """
        if len(projects) <= 1:
            return [{"id": projects[0]["id"], "uniqueness_score": 20.0}] if projects else []

        # 1. Extract just the descriptions
        descriptions = [proj["description"] for proj in projects]

        # 2. Convert all text into mathematical vectors instantly
        embeddings = self.model.encode(descriptions, convert_to_tensor=True)

        # 3. Calculate how similar every project is to every OTHER project
        # This creates a mathematical matrix of similarities (Cosine Similarity)
        cosine_scores = util.cos_sim(embeddings, embeddings)

        results = []
        for i in range(len(projects)):
            # Find the highest similarity score this project has with ANY other project
            # (We ignore comparing it to itself, which is always 1.0)
            max_similarity = 0
            for j in range(len(projects)):
                if i != j:
                    sim = cosine_scores[i][j].item()
                    if sim > max_similarity:
                        max_similarity = sim

            # 4. Calculate the Juwi Uniqueness Score (0 to 20)
            # If max similarity is 0.9 (90% clone), score = 20 * (1 - 0.9) = 2/20
            # If max similarity is 0.2 (totally unique), score = 20 * (1 - 0.2) = 16/20
            
            # We set a threshold: Anything below 0.3 similarity gets a perfect 20.
            if max_similarity < 0.3:
                uniqueness = 20.0
            else:
                uniqueness = round(20.0 * (1.0 - max_similarity), 2)
                # Ensure it doesn't drop below 0
                uniqueness = max(0.0, uniqueness)

            results.append({
                "project_id": projects[i]["id"],
                "max_similarity_to_others": round(max_similarity, 3),
                "uniqueness_score": uniqueness
            })

        return results

# --- TEST THE MODULE LOCALLY ---

if __name__ == "__main__":
    scorer = VectorUniquenessScorer()
    
    # Let's simulate 4 hackathon submissions
    dummy_submissions = [
        {"id": "Team_A", "description": "An AI flashcard app that uses OpenAI to generate study notes for college students."},
        {"id": "Team_B", "description": "A study tool using ChatGPT to make AI flashcards and quizzes for university students."},
        {"id": "Team_C", "description": "We built a generative AI application that creates flashcards for studying."},
        {"id": "Team_D", "description": "A decentralized IoT mesh network using LoRaWAN to track soil moisture for rural farmers."}
    ]
    
    print("\nAnalyzing Hackathon Submissions...")
    scores = scorer.score_uniqueness(dummy_submissions)
    
    for score in scores:
        print(f"\nProject: {score['project_id']}")
        print(f"Similarity to closest clone: {score['max_similarity_to_others'] * 100}%")
        print(f"Juwi Uniqueness Score: {score['uniqueness_score']} / 20")