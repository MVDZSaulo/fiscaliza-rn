import firebase_admin
from firebase_admin import credentials, auth
import os
import asyncio

# Configuração do Firebase (somente Auth)
def initialize_firebase():
    cred = credentials.Certificate("serviceAccountKey.json")  # Ou use Application Default Credentials
    firebase_admin.initialize_app(cred)
    return auth

auth_client = initialize_firebase()

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
            print("Admin criado com sucesso")
        except Exception as create_error:
            print(f"Erro ao criar admin: {create_error}")
    except Exception as error:
        print(f"Erro ao verificar admin: {error}")

# 2. Função de cadastro simplificada
async def handle_cadastro(email, senha):
    if len(senha) < 6:
        return {"success": False, "message": "Senha deve ter no mínimo 6 caracteres"}
    
    try:
        # Cria o usuário no Authentication
        user = auth_client.create_user(
            email=email,
            password=senha
        )
        return {
            "success": True,
            "message": "Cadastro realizado com sucesso!",
            "uid": user.uid,
            "email": user.email
        }
    
    except auth.EmailAlreadyExistsError:
        return {"success": False, "message": "E-mail já cadastrado"}
    except auth.WeakPasswordError:
        return {"success": False, "message": "Senha muito fraca (mínimo 6 caracteres)"}
    except Exception as error:
        return {"success": False, "message": f"Erro no cadastro: {str(error)}"}

# 3. Função de verificação de token
async def verify_token(id_token):
    try:
        decoded_token = auth_client.verify_id_token(id_token)
        return {
            "success": True,
            "uid": decoded_token['uid'],
            "email": decoded_token['email'],
            "message": "Token válido"
        }
    except auth.ExpiredIdTokenError:
        return {"success": False, "message": "Token expirado"}
    except auth.InvalidIdTokenError:
        return {"success": False, "message": "Token inválido"}
    except Exception as error:
        return {"success": False, "message": f"Erro na verificação: {str(error)}"}

# Função para login (no Firebase, o login é feito no frontend)
async def get_user(uid):
    try:
        user = auth_client.get_user(uid)
        return {
            "success": True,
            "user": {
                "uid": user.uid,
                "email": user.email,
                "email_verified": user.email_verified
            }
        }
    except auth.UserNotFoundError:
        return {"success": False, "message": "Usuário não encontrado"}
    except Exception as error:
        return {"success": False, "message": f"Erro ao buscar usuário: {str(error)}"}

# Exemplo de uso
if __name__ == "__main__":
    # Verificar admin ao iniciar
    asyncio.run(verificar_admin())
    
    # Exemplo de cadastro
    cadastro_result = asyncio.run(handle_cadastro(
        email="usuario@exemplo.com",
        senha="senha123"
    ))
    print("Resultado do cadastro:", cadastro_result)
    
    # Para usar com um framework web:
    # 1. O frontend faz login com Firebase Auth SDK
    # 2. Envia o token JWT para seu backend
    # 3. Você verifica com verify_token()
