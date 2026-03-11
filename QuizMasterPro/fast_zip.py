import os
import zipfile

source_dir = r"c:\Users\91939\Downloads\online-quiz-main (1)\online-quiz-main\online-quiz-app"
dest_zip = r"c:\Users\91939\Downloads\QuizMasterPro.zip"
exclude_dirs = {'node_modules', 'venv', '.git', '__pycache__', '.next'}

print(f"Creating zip at {dest_zip} from {source_dir}...")
try:
    with zipfile.ZipFile(dest_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, source_dir)
                zipf.write(file_path, arcname)
    print("Zip created successfully!")
except Exception as e:
    print(f"Failed: {e}")
