# backend/app.py
import os
import datetime
from flask import Flask, request, jsonify, send_from_directory, flash
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

app = Flask(__name__, static_folder='./build', static_url_path='/')
CORS(app)
app.secret_key = 'super secret key'

# Configuração do JWT
# Em produção, use variáveis de ambiente
app.config['JWT_SECRET_KEY'] = 'sua-chave-secreta-aqui'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(hours=1)
jwt = JWTManager(app)

# Banco de dados simulado
usuarios = {
    'usuario@exemplo.com': {
        'id': 1,
        'senha': 'senha123',  # Em produção, use senhas com hash
        'nome': 'Usuário Teste'
    }
}

tarefas = [
    {'id': 1, 'usuario_id': 1, 'titulo': 'Aprender Flask', 'completa': False},
    {'id': 2, 'usuario_id': 1, 'titulo': 'Criar uma aplicação web', 'completa': False},
    {'id': 3, 'usuario_id': 1, 'titulo': 'Estudar Python', 'completa': True}
]

# Rotas para autenticação


@app.route('/api/login', methods=['POST'])
def login():
    email = request.json.get('email', None)
    senha = request.json.get('senha', None)

    usuario = usuarios.get(email)
    flash(f'request: {email} {senha}')
    flash(f'found: {usuario}')

    if not usuario or usuario['senha'] != senha:
        return jsonify({"msg": "Credenciais inválidas"}), 401

    # Criar token JWT
    access_token = create_access_token(identity=str(usuario['id']))
    return jsonify(access_token=access_token, usuario={"id": usuario['id'], "nome": usuario['nome']})


@app.route('/api/registro', methods=['POST'])
def registro():
    email = request.json.get('email', None)
    senha = request.json.get('senha', None)
    nome = request.json.get('nome', None)

    if not email or not senha or not nome:
        return jsonify({"msg": "Dados incompletos"}), 400

    if email in usuarios:
        return jsonify({"msg": "Usuário já existe"}), 400

    # Criar novo usuário
    novo_id = len(usuarios) + 1
    usuarios[email] = {
        'id': novo_id,
        'senha': senha,  # Em produção, use hash
        'nome': nome
    }

    # Criar token JWT
    access_token = create_access_token(identity=novo_id)
    return jsonify(access_token=access_token, usuario={"id": novo_id, "nome": nome}), 201

# Rotas da API protegidas por JWT


@app.route('/api/tarefas', methods=['GET'])
@jwt_required()
def obter_tarefas():
    usuario_id = int(get_jwt_identity())
    tarefas_usuario = [t for t in tarefas if t['usuario_id'] == usuario_id]
    return jsonify(tarefas_usuario)


@app.route('/api/tarefas', methods=['POST'])
@jwt_required()
def adicionar_tarefa():
    usuario_id = get_jwt_identity()
    dados = request.json
    titulo = dados.get('titulo')

    if not titulo:
        return jsonify({'erro': 'Título da tarefa é obrigatório'}), 400

    # Encontrar próximo ID
    proximo_id = max([t['id'] for t in tarefas], default=0) + 1
    nova_tarefa = {
        'id': proximo_id,
        'usuario_id': usuario_id,
        'titulo': titulo,
        'completa': False
    }
    tarefas.append(nova_tarefa)

    return jsonify(nova_tarefa), 201


@app.route('/api/tarefas/<int:id>', methods=['PUT'])
@jwt_required()
def atualizar_tarefa(id):
    usuario_id = get_jwt_identity()
    tarefa = next(
        (t for t in tarefas if t['id'] == id and t['usuario_id'] == usuario_id), None)

    if not tarefa:
        return jsonify({'erro': 'Tarefa não encontrada'}), 404

    dados = request.json
    tarefa['completa'] = dados.get('completa', tarefa['completa'])
    tarefa['titulo'] = dados.get('titulo', tarefa['titulo'])

    return jsonify(tarefa)


@app.route('/api/tarefas/<int:id>', methods=['DELETE'])
@jwt_required()
def excluir_tarefa(id):
    usuario_id = get_jwt_identity()
    global tarefas

    # Verificar se a tarefa existe e pertence ao usuário
    tarefa = next(
        (t for t in tarefas if t['id'] == id and t['usuario_id'] == usuario_id), None)

    if not tarefa:
        return jsonify({'erro': 'Tarefa não encontrada'}), 404

    tarefas = [t for t in tarefas if t['id']
               != id or t['usuario_id'] != usuario_id]
    return jsonify({'mensagem': 'Tarefa excluída com sucesso'})

# Rota para servir o React


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
