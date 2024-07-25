export function generatePassword(){
    let password:string = ""
    for(let i=0; i<=5; i++){
        let digit = Math.floor(Math.random() * 10).toString()
        password += digit
    }
    return password
}