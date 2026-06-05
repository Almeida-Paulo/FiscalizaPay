from typing import Any

from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


class ApiException(Exception):
    def __init__(self, status_code: int, code: str, message: str, details: Any = None):
        self.status_code = status_code
        self.code = code
        self.message = message
        self.details = details


def api_error(status_code: int, code: str, message: str, details: Any = None) -> ApiException:
    return ApiException(status_code=status_code, code=code, message=message, details=details)


async def api_exception_handler(_: Request, exc: ApiException) -> JSONResponse:
    body: dict[str, Any] = {"message": exc.message, "code": exc.code}
    if exc.details is not None:
        body["details"] = exc.details
    return JSONResponse(status_code=exc.status_code, content=body)


async def validation_exception_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(
        status_code=400,
        content={
            "message": "Campos obrigatórios ausentes ou inválidos.",
            "code": "VALIDATION_ERROR",
            "details": exc.errors(),
        },
    )


async def unhandled_exception_handler(_: Request, __: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content={"message": "Erro interno do servidor.", "code": "INTERNAL_ERROR"},
    )
