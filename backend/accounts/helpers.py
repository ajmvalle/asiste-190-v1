def user_payload(user):
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
    }
