def test_register(client):
    response = client.post("/api/v1/register", json={
        "email": "newuser@example.com",
        "username": "newuser",
        "password": "newpass123"
    })
    assert response.status_code == 201
    assert response.json()["email"] == "newuser@example.com"

def test_register_duplicate(client):
    client.post("/api/v1/register", json={
        "email": "dup@example.com",
        "username": "dupuser",
        "password": "duppass123"
    })
    response = client.post("/api/v1/register", json={
        "email": "dup@example.com",
        "username": "dupuser",
        "password": "duppass123"
    })
    assert response.status_code == 400

def test_login(client):
    client.post("/api/v1/register", json={
        "email": "login@example.com",
        "username": "loginuser",
        "password": "loginpass123"
    })
    response = client.post("/api/v1/login", data={
        "username": "loginuser",
        "password": "loginpass123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_wrong_password(client):
    response = client.post("/api/v1/login", data={
        "username": "loginuser",
        "password": "wrongpass"
    })
    assert response.status_code == 401
