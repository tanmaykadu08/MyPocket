import sys
import re

with open('c:/Programing/MyPocket/frontend/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace sidebar Budget with Expenses
content = content.replace('alert(\'Budget module coming soon!\')', 'navigate(\'expenses\')')
content = content.replace('id="nav-budget"', 'id="nav-expenses"')
content = content.replace('<span>Budget</span>', '<span>Expenses</span>')

# Fix dark mode on month selectors
content = content.replace('class="month-selector w-full mb-4 text-slate-800"', 'class="month-selector w-full mb-4 text-slate-800 dark:text-slate-200"')
content = content.replace('class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-primary cursor-pointer transition-all"', 'class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 mt-1 font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary cursor-pointer transition-all"')
content = content.replace('class="month-selector md:hidden text-slate-800"', 'class="month-selector md:hidden text-slate-800 dark:text-slate-200"')
content = content.replace('class="bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-primary transition-all"', 'class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary transition-all"')

# Update dashboard buttons to openModal
content = content.replace('onclick="navigate(\'income\')"', 'onclick="openModal(\'income\')"')
content = content.replace('onclick="navigate(\'expenses\')"', 'onclick="openModal(\'expense\')"')

# Add hover scale
content = content.replace('shadow-lg shadow-primary/20 flex items-center gap-2 transition-all"', 'shadow-lg shadow-primary/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"')
content = content.replace('shadow-lg shadow-red-500/20 flex items-center gap-2 transition-all"', 'shadow-lg shadow-red-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"')

# Extract forms from sec-income and sec-expenses and remove them
inc_form_match = re.search(r'(<div class="form-card">\s*<div class="form-title">Add income source.*?</div>\s*</div>)', content, re.DOTALL)
inc_form_html = inc_form_match.group(1) if inc_form_match else ''
content = content.replace(inc_form_html, '<div class="flex justify-between items-center mb-4"><p class="text-sm text-slate-500">Your logged income sources</p><button class="btn btn-primary shadow-lg hover:scale-105 active:scale-95 transition-all" onclick="openModal(\'income\')">+ Add Income</button></div>')

exp_form_match = re.search(r'(<div class="form-card">\s*<div class="form-title">Add expense.*?</div>\s*</div>)', content, re.DOTALL)
exp_form_html = exp_form_match.group(1) if exp_form_match else ''
content = content.replace(exp_form_html, '<div class="flex justify-between items-center mb-4"><p class="text-sm text-slate-500">Your logged expenses</p><button class="btn btn-primary shadow-lg bg-red-500 hover:bg-red-600 hover:scale-105 active:scale-95 transition-all" onclick="openModal(\'expense\')">+ Add Expense</button></div>')

modal_html = f'''
  <!-- Transaction Modal -->
  <div id="transactionModal" class="fixed inset-0 z-[100] flex items-center justify-center hidden opacity-0 transition-opacity duration-300">
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onclick="closeModal()"></div>
    <div class="bg-surface-container-lowest dark:bg-slate-800 rounded-[2rem] shadow-2xl p-6 md:p-8 z-10 w-[90%] max-w-xl transform scale-95 transition-transform duration-300" id="modalContent">
      <div class="flex justify-between items-center mb-6 border-b border-outline-variant/10 pb-4">
        <h3 class="text-2xl font-headline font-bold text-on-surface dark:text-white" id="modalTitle">Add Transaction</h3>
        <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700 p-2 rounded-full transition-colors" onclick="closeModal()">
          <span class="material-symbols-outlined text-sm">close</span>
        </button>
      </div>

      <div id="modal-income-form" class="hidden">
        {inc_form_html.replace('form-card', 'modal-form-wrap')}
      </div>
      
      <div id="modal-expense-form" class="hidden">
        {exp_form_html.replace('form-card', 'modal-form-wrap')}
      </div>
    </div>
  </div>
'''

content = content.replace('</body>', modal_html + '\n</body>')

with open('c:/Programing/MyPocket/frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Success')
