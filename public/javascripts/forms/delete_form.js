class DeleteForm extends React.Component {
    constructor(props) {
        super(props)
    }

    async onDeleteAccount() {
        try {
            let response = await deleteRequest('user')
            this.props.history.replace("/l")
            alert('Your account was deleted')
        } catch (status) {
            alert('Request failed, please check connection')
        }
    }

    render() {
        let element = (
            <div id="deletion" className="centeredcontainer">
            
            <br/> <br/>
                <div className="centeredcontainer" className="resultMessage">
                    <p>Delete your account</p>
                    <p>and all your data?</p> 
                </div>

                <div className="centeredcontainer">
                    <button type="button" className="sketch1" onClick={() => this.props.history.replace('/')}>Cancel</button>
                    <button type="button" className="sketch3" onClick={() => this.onDeleteAccount()}>Delete</button> 
                </div>
            </div>
        )
        return element
    }
}
