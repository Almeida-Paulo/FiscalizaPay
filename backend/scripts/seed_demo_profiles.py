from sqlalchemy import select

from app.database import SessionLocal
from app.models import Profile

DEMO_PROFILES = [
    ("Maria Santos", "GESTOR", "0x1111111111111111111111111111111111111111"),
    ("Carlos Silva", "FORNECEDOR", "0x2222222222222222222222222222222222222222"),
    ("João Logística", "ENTREGADOR", "0x3333333333333333333333333333333333333333"),
    ("Ana Fiscal", "FISCAL", "0x4444444444444444444444444444444444444444"),
    ("Roberto Auditor", "AUDITOR", "0x5555555555555555555555555555555555555555"),
]


def main() -> None:
    with SessionLocal() as db:
        for name, role, wallet in DEMO_PROFILES:
            profile = db.scalar(select(Profile).where(Profile.wallet_address == wallet))
            if profile is None:
                db.add(Profile(name=name, role=role, wallet_address=wallet))
                print(f"Criado: {name} | {role} | {wallet}")
            else:
                print(f"Já existe: {name} | {role} | {wallet}")
        db.commit()


if __name__ == "__main__":
    main()
