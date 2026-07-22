import chefIcon from "../assets/chef-icon.png";

export default function Header() {
  return (
    <header>
      <img src={chefIcon} alt="Robot Chef Icon" className="chef-icon" />
      <h1 className="header-text">Chef Gemini</h1>
    </header>
  );
}
