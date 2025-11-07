https://medium.com/@johnidouglasmarangon/build-a-speech-to-text-service-in-python-with-faster-whisper-39ad3b1e2305

Three years ago, I developed a speech-to-text system integrated with a video recorder used for recording court hearings in Brazil. The solution was optimized to operate efficiently on limited CPU resources and minimize memory usage. To address this challenge, I utilized Vosk, a lightweight speech recognition toolkit, which delivered satisfactory performance.

With advancements in large language models (LLMs) and Transformers, a promising solution has emerged: Whisper, a versatile speech recognition model that excels at this task. However, achieving optimal performance requires the use of GPUs.

After spending several days exploring how Whisper operates and seeking ways to enhance transcription quality, I discovered the Faster Whisper project. This project helps maintain affordable hardware requirements for app users.

What is Whisper and Faster Whisper?
Whisper, developed by OpenAI, is an advanced open-source automatic speech recognition (ASR) system designed for high-accuracy transcription across multiple languages. Trained on a diverse multilingual dataset, Whisper excels at transcribing, translating, and identifying spoken language. Its encoder-decoder Transformer architecture enables robust performance in noisy environments, overlapping speech, and complex audio inputs.

However, Whisper’s flexibility is accompanied by high computational demands. Its models range from Tiny to Large and require substantial resources for efficient operation, particularly in real-time applications.

Faster Whisper is an optimized version of Whisper, designed to provide faster inference with reduced resource consumption. It is especially beneficial in scenarios where performance and speed are important but not critical. Faster Whisper balances maintaining the original model’s accuracy while meeting the needs of contemporary high-performance applications.

Why did I choose Faster Whisper?
Cost was a significant consideration. The application runs on-premise, and customers have been utilizing an affordable infrastructure solution for years, logging thousands of recorded hours monthly. Transitioning to an API-based solution or using GPUs would increase costs. Therefore, the challenge was to enhance quality while keeping expenses low.

https://github.com/AIXerum/faster-whisper

WhisperLive is a nearly-live implementation of OpenAI's Whisper which uses faster-whisper as the backend to transcribe audio in real-time.



You said:
PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025\Speech_to_text_Transcribe_Attempt_5> git lfs install
Updated Git hooks.
Git LFS initialized.
PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025\Speech_to_text_Transcribe_Attempt_5> git add .gitattributes
fatal: pathspec '.gitattributes' did not match any files
PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025\Speech_to_text_Transcribe_Attempt_5> git commit -m "Track large files with Git LFS"
On branch main
nothing to commit, working tree clean
PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025\Speech_to_text_Transcribe_Attempt_5> git push origin main
To https://github.com/727hungrycoder/Speech_to_text_Transcribe_Attempt_5.git
 ! [rejected]          main -> main (non-fast-forward)
error: failed to push some refs to 'https://github.com/727hungrycoder/Speech_to_text_Transcribe_Attempt_5.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. Integrate the remote changes (e.g.
hint: 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025\Speech_to_text_Transcribe_Attempt_5> 
You said:
PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025\Speech_to_text_Transcribe_Attempt_5> git add node_modules/@next/swc-win32-x64-msvc/next-swc.win32-x64-msvc.node
The following paths are ignored by one of your .gitignore files:
node_modules
hint: Use -f if you really want to add them.
hint: Turn this message off by running
hint: "git config advice.addIgnoredFile false"
PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025\Speech_to_text_Transcribe_Attempt_5> git commit -m "Add large files via Git LFS"
On branch main
nothing to commit, working tree clean
PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025\Speech_to_text_Transcribe_Attempt_5> 
You said:
nothing to commit, working tree clean
PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025\Speech_to_text_Transcribe_Attempt_5> git rm -r --cached node_modules
fatal: pathspec 'node_modules' did not match any files
PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025\Speech_to_text_Transcribe_Attempt_5> git rm -r --cached venv
fatal: pathspec 'venv' did not match any files
PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025\Speech_to_text_Transcribe_Attempt_5> 
You said:
Successfully installed PyYAML-6.0.3 arrow-1.4.0 bfg-0.1.0 h2-2.6.2 hpack-3.0.0 hyper-0.7.0 hyperframe-3.2.0 numpy-2.3.4 pandas-2.3.3 python-dateutil-2.9.0.post0 pytoml-0.1.21 pytz-2025.2 six-1.17.0 tzdata-2025.2
PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025\Speech_to_text_Transcribe_Attempt_5> bfg --strip-blobs-bigger-than 50M
bfg : The term 'bfg' is not recognized as the name of a cmdlet, function, script file, or operable program. Check the spelling of the name, or if a path was included, verify that the path is correct and try again.
At line:1 char:1
+ bfg --strip-blobs-bigger-than 50M
+ ~~~
    + CategoryInfo          : ObjectNotFound: (bfg:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException
 
PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025\Speech_to_text_Transcribe_Attempt_5>
You said:
i dont have java!
You said:
git filter-repo --strip-blobs-bigger-than 50M
git: 'filter-repo' is not a git command. See 'git --help'.
PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025> git filter-repo --invert-paths --paths venv/Lib/site-packages/ctranslate2/ctranslate2.dll node_modules/@next/swc-win32-x64-msvc/next-swc.win32-x64-msvc.node   
git: 'filter-repo' is not a git command. See 'git --help'.
PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025> 
You said:
PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025> git filter-repo --strip-blobs-bigger-than 50M
git: 'filter-repo' is not a git command. See 'git --help'.
PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025> git filter-repo --invert-paths --paths venv/Lib/site-packages/ctranslate2/ctranslate2.dll node_modules/@next/swc-win32-x64-msvc/next-swc.win32-x64-msvc.node   
git: 'filter-repo' is not a git command. See 'git --help'.
PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025> pip install git-filter-repo
Defaulting to user installation because normal site-packages is not writeable
Requirement already satisfied: git-filter-repo in c:\users\raj\appdata\roaming\python\python314\site-packages (2.47.0)
PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025> 
You said:
S C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025\Speech_to_text_Transcribe_Attempt_5> pip install git-filter-repo
Defaulting to user installation because normal site-packages is not writeable
Requirement already satisfied: git-filter-repo in c:\users\raj\appdata\roaming\python\python314\site-packages (2.47.0)
PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025\Speech_to_text_Transcribe_Attempt_5> git filter-repo --strip-blobs-bigger-than 50M
git: 'filter-repo' is not a git command. See 'git --help'.
PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025\Speech_to_text_Transcribe_Attempt_5> 
You said:
PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025\Speech_to_text_Transcribe_Attempt_5> git filter-repo --strip-blobs-bigger-than 50M
Aborting: Refusing to destructively overwrite repo history since
this does not look like a fresh clone.
  (expected freshly packed repo)
Please operate on a fresh clone instead.  If you want to proceed
anyway, use --force.
PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025\Speech_to_text_Transcribe_Attempt_5> 
You said:
PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025\Speech_to_text_Transcribe_Attempt_5> git push --set-upstream origin main
To https://github.com/727hungrycoder/Speech_to_text_Transcribe_Attempt_5
 ! [rejected]          main -> main (non-fast-forward)
error: failed to push some refs to 'https://github.com/727hungrycoder/Speech_to_text_Transcribe_Attempt_5'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. Integrate the remote changes (e.g.
hint: 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025\Speech_to_text_Transcribe_Attempt_5> 

Cha