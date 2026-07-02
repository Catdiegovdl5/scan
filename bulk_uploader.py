import os
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

def upload_file(filepath: str, bucket_name: str, destination_path: str):
    with open(filepath, 'rb') as f:
        # Cache control adicionado conforme sugestão
        res = supabase.storage.from_(bucket_name).upload(
            file=f,
            path=destination_path,
            file_options={
                "content-type": "image/webp",
                "x-upsert": "true",
                "cache-control": "public, max-age=31536000, immutable"
            }
        )
        print(f"Uploaded {filepath} -> {res}")

if __name__ == "__main__":
    print("Script de upload configurado.")
