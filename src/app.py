# app.py
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# Vamos usar uma lista simples para armazenar as tarefas
# Em um aplicativo real, usaríamos um banco de dados
tarefas = [
    {'id': 1, 'titulo': 'Aprender Flask', 'completa': False},
    {'id': 2, 'titulo': 'Criar uma aplicação web', 'completa': False},
    {'id': 3, 'titulo': 'Estudar Python', 'completa': True}
]


@app.route('/')
def index():
    return render_template('index.html', tarefas=tarefas)


@app.route('/adicionar', methods=['POST'])
def adicionar():
    titulo = request.form.get('titulo')
    if titulo:
        # Encontrar o maior ID e adicionar 1
        proximo_id = max(tarefa['id']
                         for tarefa in tarefas) + 1 if tarefas else 1
        nova_tarefa = {'id': proximo_id, 'titulo': titulo, 'completa': False}
        tarefas.append(nova_tarefa)
    return redirect(url_for('index'))


@app.route('/completar/<int:id>')
def completar(id):
    for tarefa in tarefas:
        if tarefa['id'] == id:
            tarefa['completa'] = not tarefa['completa']
            break
    return redirect(url_for('index'))


@app.route('/excluir/<int:id>')
def excluir(id):
    global tarefas
    tarefas = [tarefa for tarefa in tarefas if tarefa['id'] != id]
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
