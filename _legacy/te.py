import os
from pathlib import Path

def dump_site_to_txt(output_filename="site_dump.txt"):
    root_dir = Path(".")
    
    # Ignore folders jo system ya dependencies ke hain aur jinhe analyze karne ki zaroorat nahi
    ignored_dirs = {'.git', 'node_modules', '.next', '__pycache__', 'dist', 'build', '.vscode'}
    
    # Code aur data files ki valid extensions
    valid_extensions = {'.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.css', '.html', '.py', '.txt'}

    print("🔄 Generating comprehensive site dump for AI processing...")

    file_count = 0
    with open(output_filename, "w", encoding="utf-8") as out_file:
        for p in sorted(root_dir.rglob("*")):
            # Skip ignored directories
            if any(part in ignored_dirs for part in p.parts):
                continue
            
            if p.is_file() and p.suffix.lower() in valid_extensions:
                # Output file ko khud ignore karein agar pehle se bani ho
                if p.name == output_filename:
                    continue
                
                file_count += 1
                out_file.write(f"\n{'='*80}\n")
                out_file.write(f"FILE PATH: {p}\n")
                out_file.write(f"{'='*80}\n\n")
                
                try:
                    with open(p, "r", encoding="utf-8", errors="ignore") as f:
                        out_file.write(f.read())
                    out_file.write("\n\n")
                except Exception as e:
                    out_file.write(f"[Error reading file: {e}]\n\n")

    print(f"✅ Success! Processed {file_count} files. Entire site dump saved to '{output_filename}'.")

if __name__ == "__main__":
    dump_site_to_txt()