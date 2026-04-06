import { AxiosError } from 'axios';

export function getErrorMessage(error: unknown, defaultMessage: string = "Ocorreu um erro inesperado."): string {

  if (!(error instanceof AxiosError)) {
    return defaultMessage;
  }


  const backendData = error.response?.data as any;
  const backendMessage = backendData?.error || backendData?.message || error.message || "";
  
  
  const lowerMsg = String(backendMessage).toLowerCase();

  
  if (lowerMsg.includes("already exists") || lowerMsg.includes("exists") || error.response?.status === 409) {
    return "Este registro já existe no banco de dados. Verifique o título ou número e tente novamente.";
  }

 
  if (
    lowerMsg.includes("dependent") || 
    lowerMsg.includes("reference") || 
    lowerMsg.includes("in use") || 
    lowerMsg.includes("associated") ||
    lowerMsg.includes("child")
  ) {
    return "Não é possível excluir. Existem outros registros (como temporadas ou episódios) vinculados a este item.";
  }

  
  if (lowerMsg.includes("not found") || lowerMsg.includes("does not exist") || error.response?.status === 404) {
    return "O registro solicitado não foi encontrado.";
  }

  
  if (lowerMsg.includes("validation") || lowerMsg.includes("required") || error.response?.status === 400) {
    return "Os dados enviados são inválidos ou estão incompletos. Verifique o formulário.";
  }


  console.error("🔍 [Unhandled API Error]:", backendMessage);
  
  return defaultMessage;
}