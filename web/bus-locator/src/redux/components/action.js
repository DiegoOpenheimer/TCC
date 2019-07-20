export const types = {
    UPDATE_COMPONENT_LOADING: 'UPDATE_COMPONENT_LOADING'
}

export function updateLoading(value) {
    return {
        type: types.UPDATE_COMPONENT_LOADING,
        payload: { value }
    }
}