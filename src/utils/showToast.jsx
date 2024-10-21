export const showToastSuccess = (summary, detail, life) => {
    return {
        severity: 'success',
        summary,
        detail,
        life
    }
}

export const showToastWarn = (summary, detail, life) => {
    return {
        severity: 'warn',
        summary,
        detail,
        life
    }
}

export const showToastError = (error, life) => {
    const errorSummary = error?.summary || error?.response?.statusText || error?.data?.message || "Oops!";
    const errorCode = error?.code || error?.response?.status || error?.status;
    const errorText = error?.text || error?.response?.data?.error || error?.response?.data?.message || error.message;
    return {
        severity: 'warn',
        summary: errorSummary,
        detail: (
            <>
                {!errorSummary || !errorText ? (
                    <p>Неизвестная ошибка</p>
                ) : (
                    <ul>
                        <li>{`Код ошибки: ${errorCode}`}</li>
                        <li>{`Текст ошибки: ${errorText}`}</li>
                    </ul>
                )}
            </>
        ), 
        life
    }
}
