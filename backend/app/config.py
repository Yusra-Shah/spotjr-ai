from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    azure_ai_project_endpoint: str = ""
    azure_openai_endpoint: str = ""
    azure_openai_api_key: str = ""
    azure_ai_vision_endpoint: str = ""
    azure_ai_vision_key: str = ""
    azure_blob_connection_string: str = ""
    azure_blob_container_name: str = ""
    jwt_secret: str = ""

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
