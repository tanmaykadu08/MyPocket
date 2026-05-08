import re

with open('c:/Programing/MyPocket/frontend/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix Tailwind dark mode config
content = content.replace('darkMode: "class",', 'darkMode: "media",')

# 2. Fix Sidebar Navigation onclicks
content = content.replace('onclick="openModal(\'expense\')" id="nav-expenses"', 'onclick="navigate(\'expenses\')" id="nav-expenses"')
content = content.replace('onclick="openModal(\'income\')" id="nav-income"', 'onclick="navigate(\'income\')" id="nav-income"')

# 3. Add Collapse button to Sidebar
sidebar_bottom = '''
        <button class="w-full flex items-center gap-3 text-slate-500 dark:text-slate-400 px-4 py-3 hover:bg-slate-200/50 transition-colors rounded-xl" onclick="doLogout()">
          <span class="material-symbols-outlined" data-icon="logout">logout</span>
          <span class="sidebar-text">Log Out</span>
        </button>
        <button class="w-full flex items-center gap-3 text-slate-500 dark:text-slate-400 px-4 py-3 hover:bg-slate-200/50 transition-colors rounded-xl mt-2" onclick="toggleSidebar()">
          <span class="material-symbols-outlined" id="sidebar-toggle-icon">keyboard_double_arrow_left</span>
          <span class="sidebar-text" id="sidebar-toggle-text">Collapse</span>
        </button>
'''
logout_match = re.search(r'(<button[^>]*onclick="doLogout\(\)"[^>]*>[\s\S]*?</button>)', content)
if logout_match:
    content = content.replace(logout_match.group(1), sidebar_bottom)

# 4. Add 'sidebar-text' class to all navigation span texts inside sidebar to easily hide them
content = re.sub(r'(<button[^>]*>.*?<span class="material-symbols-outlined"[^>]*>.*?</span>\s*)<span>(.*?)</span>', r'\1<span class="sidebar-text">\2</span>', content, flags=re.DOTALL)

with open('c:/Programing/MyPocket/frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('HTML Updated!')
