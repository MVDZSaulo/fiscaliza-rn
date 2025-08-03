import firebase_admin
from firebase_admin import credentials, auth, firestore
from datetime import datetime
import os

# Configuração do Firebase
def initialize_firebase():
    # Você pode usar um arquivo de configuração ou variáveis de ambiente
    cred = credentials.Certificate("serviceAccountKey.json")  # Ou use Application Default Credentials
    firebase_admin.initialize_app(cred, {
        'apiKey': "AIzaSyBx-Y8qRzds70GYvlJK9rifeHTzKFNG1Ss",
        'authDomain': "fiscalizarn-b4e81.firebaseapp.com",
        'projectId': "fiscalizarn-b4e81",
        'storageBucket': "fiscalizarn-b4e81.appspot.com",
        'messagingSenderId': "486825833189",
        'appId': "1:486825833189:web:057a8cba57182431d19a0c"
    })
    
    return auth, firestore.client()

auth_client, db = initialize_firebase()

# 1. Verifica e cria admin padrão se necessário
async def verificar_admin():
    admin_email = "admin@fiscalizarn.com"
    admin_senha = "Admin@1234"
    
    try:
        # Tenta obter o usuário pelo email
        user = auth_client.get_user_by_email(admin_email)
        print("Admin já existe")
    except auth.UserNotFoundError:
        try:
            # Cria o usuário
            user = auth_client.create_user(
                email=admin_email,
                password=admin_senha,
                email_verified=True
            )
            
            # Adiciona dados no Firestore
            user_ref = db.collection("usuarios").document(user.uid)
            user_ref.set({
                "nome": "Administrador",
                "email": admin_email,
                "role": "admin",
                "criadoEm": datetime.now()
            })
            print("Admin criado com sucesso")
        except Exception as create_error:
            print(f"Erro ao criar admin: {create_error}")
    except Exception as error:
        print(f"Erro ao verificar admin: {error}")

# 2. Função de cadastro
async def handle_cadastro(nome, email, senha, codigo_convite):
    if len(senha) < 6:
        return {"success": False, "message": "Senha deve ter no mínimo 6 caracteres"}
    
    try:
        # Cria o usuário no Authentication
        user = auth_client.create_user(
            email=email,
            password=senha
        )
        
        # Determina o role baseado no código de convite
        role = "admin" if codigo_convite == "ADMIN-2023" else "user"
        
        # Adiciona dados no Firestore
        user_ref = db.collection("usuarios").document(user.uid)
        user_ref.set({
            "nome": nome,
            "email": email,
            "role": role,
            "criadoEm": datetime.now()
        })
        
        return {"success": True, "message": "Cadastro realizado com sucesso!"}
    
    except auth.EmailAlreadyExistsError:
        return {"success": False, "message": "E-mail já cadastrado"}
    except auth.WeakPasswordError:
        return {"success": False, "message": "Senha muito fraca (mínimo 6 caracteres)"}
    except Exception as error:
        return {"success": False, "message": f"Erro no cadastro: {str(error)}"}

# 3. Função de login (no backend, você normalmente verificaria o token)
async def verify_token(id_token):
    try:
        decoded_token = auth_client.verify_id_token(id_token)
        uid = decoded_token['uid']
        
        # Verifica se existe no Firestore
        user_ref = db.collection("usuarios").document(uid)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            auth_client.revoke_refresh_tokens(uid)
            return {"success": False, "message": "Usuário não registrado no sistema"}
        
        return {
            "success": True,
            "uid": uid,
            "user_data": user_doc.to_dict(),
            "message": "Login verificado com sucesso"
        }
    
    except auth.ExpiredIdTokenError:
        return {"success": False, "message": "Token expirado"}
    except auth.RevokedIdTokenError:
        return {"success": False, "message": "Token revogado"}
    except auth.InvalidIdTokenError:
        return {"success": False, "message": "Token inválido"}
    except Exception as error:
        return {"success": False, "message": f"Erro na verificação: {str(error)}"}

# Funções auxiliares
def handle_auth_error(error):
    error_map = {
        'INVALID_EMAIL': 'E-mail inválido',
        'USER_DISABLED': 'Conta desativada',
        'USER_NOT_FOUND': 'Usuário não encontrado',
        'WRONG_PASSWORD': 'Senha incorreta',
        'EMAIL_ALREADY_EXISTS': 'E-mail já cadastrado',
        'OPERATION_NOT_ALLOWED': 'Operação não permitida',
        'TOO_MANY_ATTEMPTS_TRY_LATER': 'Muitas tentativas. Tente mais tarde.',
        'WEAK_PASSWORD': 'Senha muito fraca (mínimo 6 caracteres)'
    }
    
    error_code = getattr(error, 'code', str(error))
    return error_map.get(error_code, f"Erro: {str(error)}")

# Exemplo de uso
if __name__ == "__main__":
    # Verificar admin ao iniciar
    import asyncio
    asyncio.run(verificar_admin())
    
    # Exemplo de cadastro
    cadastro_result = asyncio.run(handle_cadastro(
        nome="Novo Usuário",
        email="novo@exemplo.com",
        senha="senha123",
        codigo_convite=""
    ))
    print(cadastro_result)
    
    # Para login, você normalmente usaria um framework como Flask ou FastAPI
    # para receber o token do frontend e verificar
