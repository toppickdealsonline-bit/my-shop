import React from "react";

export default function Footer({ contact = "", instagram = "" }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div>© {new Date().getFullYear()} TopPickDeals</div>
        <div style={{ marginTop: 6 }}>
          Contact: {contact} •{" "}
          <a href={instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
