import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
const FormData = require('form-data');

class UploadCard extends Component {
	// State will get be filled with changes to input components
	state = {
		selectedFile: null,
		ipfsLink: null,
		previewImg: null
	};
	fileSelectedHandler = (event) => {
		console.log(event.target.files[0]);
		const reader = new FileReader();
		reader.onload = () => {
			if (reader.readyState === 2) {
				this.setState({ previewImg: reader.result });
			}
		};
		reader.readAsDataURL(event.target.files[0]);
		//	reader.readAsDataURL(e.target.files[0]);
		this.setState({
			selectedFile: event.target.files[0]
		});
	};
	fileUploadHandler = async () => {
		this.setState({
			ipfsLink: 'Loading this wait.....'
		});
		let data = new FormData();
		data.append('file', this.state.selectedFile);
		const pinataApiKey = 'c07968e5d6ff5ee061d0';
		const pinataSecretApiKey = 'e352f168ae7ab0ab7002181169c6c108ed6bebb172ce73aeea8a22ee6d09d5ec';
		const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
		await axios
			.post(url, data, {
				maxContentLength: 'Infinity',
				headers: {
					'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
					pinata_api_key: pinataApiKey,
					pinata_secret_api_key: pinataSecretApiKey
				}
			})
			.then((res) => {
				console.log(`https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`);
				this.setState({
					ipfsLink: 'https://gateway.pinata.cloud/ipfs/' + res.data.IpfsHash
				});
			});
	};

	render() {
		return (
			<div className="container">
				<div>
					<img src={this.state.previewImg} />
					<input type="file" onChange={this.fileSelectedHandler} />
					<button onClick={this.fileUploadHandler}>Upload!</button>
					<br />
					<a href={this.state.ipfsLink} target="_blank">
						{' '}
						{this.state.ipfsLink}{' '}
					</a>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		userAddress: state.account.accountAddress.address
	};
};

export default connect(mapStateToProps)(UploadCard);
