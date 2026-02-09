import google.generativeai as genai
import os

key = "AIzaSyBEQ8pHChEmsT5amGjxwdsv3IEpAQVdi3g"

try:
    genai.configure(api_key=key)
    model = genai.GenerativeModel("gemini-1.5-flash") # gemini-pro is legacy, flash is safer
    response = model.generate_content("Say hello")
    print(f"SUCCESS: {response.text}")
except Exception as e:
    print(f"ERROR: {e}")
