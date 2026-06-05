import argparse

from sqlalchemy import select

from app.database import SessionLocal
from app.models import Profile, UserRole
from app.security import normalize_wallet


def main() -> None:
    parser = argparse.ArgumentParser(description="Cria ou atualiza um perfil FiscalizaPay.")
    parser.add_argument("--name", required=True, help="Nome exibido do perfil")
    parser.add_argument("--role", required=True, choices=[role.value for role in UserRole], help="Role do perfil")
    parser.add_argument("--wallet", required=True, help="Wallet EVM real do usuário")
    args = parser.parse_args()

    wallet = normalize_wallet(args.wallet)

    with SessionLocal() as db:
        profile = db.scalar(select(Profile).where(Profile.wallet_address == wallet))
        if profile is None:
            profile = Profile(name=args.name, role=args.role, wallet_address=wallet)
            db.add(profile)
            action = "criado"
        else:
            profile.name = args.name
            profile.role = args.role
            action = "atualizado"
        db.commit()
        print(f"Perfil {action}: {profile.name} | {profile.role} | {profile.wallet_address}")


if __name__ == "__main__":
    main()
