// función para mapear las variables de entorno
export const EnvConfiguration = () => ({
    enviroment    : process.env.NODE_ENV || 'dev',
    mongodb       : process.env.MONGODB,
    port          : process.env.PORT || 3002,
    default_limit :+process.env.DEFAULT_LIMIT || 7 // + convierte el valor a numero, porque las variable de entorno por defecto se graban como string
}); 