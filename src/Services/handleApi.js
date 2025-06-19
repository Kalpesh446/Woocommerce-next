export const handleApiRes = res => {
    return {
        data: res.data
    }
}

export const handleApiErr = err => {
    if (err.response) {
        return {
            message: 'A Server Error occurred',
            status: err.response.status,
            data: err.response.data
        }
    } else if (err.request) {
        return {
            message: 'No Response Received From Server',
            request: err.request
        }
    } else {
        return {
            message: 'An Error Occurred While Setting Up the Request',
            error: err.message
        }
    }
}