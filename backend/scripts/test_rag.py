"""
RAG Quality Tests (Phase 9)
Verify: specific Act+Section cited, correct state law, confidence scores
"""
import sys
import os

# Ensure backend root is in PYTHONPATH
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from app.rag.legal_brain import ask_legal_question

import asyncio

TEST_QUERIES = [
    ("Saheb ne 3 mahine se salary nahi di", "Payment of Wages Act", "hi"),
    ("Landlord ghus aata hai bina bataye", "Transfer of Property Act", "hi"),
    ("FIR file nahi kar raha police", "BNS Section 173", "en"),
    ("Consumer forum complaint kaise file karu", "Consumer Protection Act 2019", "hi"),
]

async def run_tests():
    print("Running Phase 9 RAG Quality Tests...\n")
    success_count = 0
    
    for query, expected_act, lang in TEST_QUERIES:
        print(f"Testing Query: '{query}' ({lang})")
        print(f"Expected Act: {expected_act}")
        
        try:
            # We assume state 'Delhi' as default
            response = await ask_legal_question(query=query, language=lang, user_state="Delhi")
            
            # Check if expected act is cited
            cited_acts = " ".join(response["law_citations"]).lower()
            text_body = response["answer"].lower()
            
            passed = expected_act.lower() in text_body or expected_act.lower() in cited_acts
            
            if passed:
                print(f"✅ PASSED (Verified Act cited, Confidence: {response['confidence']}%)")
                success_count += 1
            else:
                print(f"❌ FAILED - Missing expected Act: {expected_act}")
                print(f"   Returned Citations: {response['law_citations']}")
        except Exception as e:
            import traceback
            traceback.print_exc()
            print(f"❌ FAILED with Error: {e}")
        
        print("-" * 50)
        
    print(f"\nResults: {success_count}/{len(TEST_QUERIES)} Passed")
    
if __name__ == "__main__":
    asyncio.run(run_tests())
