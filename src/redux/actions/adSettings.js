export const adRequest = () => async (dispatch) => {
    try {
        let response = await fetch(
            'https://raw.githubusercontent.com/manthanvanani/application_details/main/player.json'
        );
        let json = await response.json();
        dispatch({ type: 'AD_REQ', payload: json });
    } catch (e) {
        console.log(e)
    }
};
