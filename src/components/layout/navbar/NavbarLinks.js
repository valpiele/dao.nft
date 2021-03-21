import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import M from 'materialize-css';

class NavbarLinks extends Component {
	componentDidMount() {
		let elems = document.querySelectorAll('.dropdown-trigger');
		M.Dropdown.init(elems, {
			constrainWidth: false,
			hover: true,
			gutter: 0,
			coverTrigger: false
		});
	}

	render() {
		return (
			<div>
				<ul id="nav-dropdown-leasing" className="dropdown-content">
					<li>
						<NavLink to="/newlease" className="indigo-text text-darken-4">
							My NFTs
						</NavLink>
					</li>
					<li className="divider" />
					<li>
						<NavLink to="/myleaseoffers" className="indigo-text text-darken-4">
							My listings
						</NavLink>
					</li>
					<li className="divider" />
					<li>
						<NavLink to="/allleaseoffers" className="indigo-text text-darken-4">
							NFTs for voting
						</NavLink>
					</li>
					<li className="divider" />
					<li>
						<NavLink to="/upload" className="indigo-text text-darken-4">
							Upload To Pinata
						</NavLink>
					</li>
				</ul>
				<ul className="right">
					<li>
						<a className="dropdown-trigger" data-target="nav-dropdown-leasing">
							Leasing
							<i className="material-icons right">arrow_drop_down</i>
						</a>
					</li>
					<li>
						<NavLink to="/allloans" className="indigo-text text-darken-4">
							NFTs for auction
						</NavLink>
					</li>
					<li>
						<NavLink to="/" className="amber-text text-lighten-1">
							Docs
						</NavLink>
					</li>
				</ul>
			</div>
		);
	}
}

export default NavbarLinks;
