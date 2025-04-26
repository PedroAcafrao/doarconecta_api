export default async function connect(){
    const connect = await  mysql.open();
    return connection
}