
import uvicorn
import socket


if __name__ == "__main__":
    print("Server is running")
    hostname = socket.gethostname()
    ip_address = socket.gethostbyname(hostname)
    print(f"Hostname: {hostname}")
    print(f"IP Address: {ip_address}")
    uvicorn.run("main.App.__app:app", host=ip_address, port=8000, reload=True)
    print("Server is running")