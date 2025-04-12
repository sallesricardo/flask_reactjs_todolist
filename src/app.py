# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Habilita CORS para permitir requisições do frontend React

# Lista simples para armazenar as tarefas (em uma aplicação real, usaríamos um banco de dados)
tarefas = [
    {'id': 1, 'titulo': 'Aprender Flask', 'completa': False},
    {'id': 2, 'titulo': 'Criar uma aplicação web', 'completa': False},
    {'id': 3, 'titulo': 'Estudar Python', 'completa': True}
]


@app.route('/api/tarefas', methods=['GET'])
def obter_tarefas():
    return jsonify(tarefas)


@app.route('/api/tarefas', methods=['POST'])
def adicionar_tarefa():
    dados = request.json
    titulo = dados.get('titulo')

    if not titulo:
        return jsonify({'erro': 'Título da tarefa é obrigatório'}), 400

    # Encontrar o maior ID e adicionar 1
    proximo_id = max(tarefa['id'] for tarefa in tarefas) + 1 if tarefas else 1
    nova_tarefa = {'id': proximo_id, 'titulo': titulo, 'completa': False}
    tarefas.append(nova_tarefa)

    return jsonify(nova_tarefa), 201


@app.route('/api/tarefas/<int:id>', methods=['PUT'])
def atualizar_tarefa(id):
    tarefa = next((t for t in tarefas if t['id'] == id), None)

    if not tarefa:
        return jsonify({'erro': 'Tarefa não encontrada'}), 404

    dados = request.json
    tarefa['completa'] = dados.get('completa', tarefa['completa'])
    tarefa['titulo'] = dados.get('titulo', tarefa['titulo'])

    return jsonify(tarefa)


@app.route('/api/tarefas/<int:id>', methods=['DELETE'])
def excluir_tarefa(id):
    global tarefas
    tarefa = next((t for t in tarefas if t['id'] == id), None)

    if not tarefa:
        return jsonify({'erro': 'Tarefa não encontrada'}), 404

    tarefas = [t for t in tarefas if t['id'] != id]
    return jsonify({'mensagem': 'Tarefa excluída com sucesso'})


if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
