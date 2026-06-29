def test_create_resource(client, auth_headers):
    response = client.post("/api/v1/resources/", json={
        "name": "Test Server",
        "resource_id": "test-001",
        "provider": "aws",
        "resource_type": "EC2",
        "region": "us-east-1",
        "hourly_cost": 0.096,
        "monthly_cost": 69.12
    }, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["name"] == "Test Server"

def test_get_resources(client, auth_headers):
    response = client.get("/api/v1/resources/", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_analytics_summary(client, auth_headers):
    response = client.get("/api/v1/analytics/summary", headers=auth_headers)
    assert response.status_code == 200
    assert "total_monthly_cost" in response.json()
