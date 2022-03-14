import React, { FC, useMemo } from "react";

interface Props {}

const Badges: FC<Props> = (props: Props): JSX.Element => {
  const badgeInfo = useMemo(
    () => [
      [
        "https://www.npmjs.com/package/ts-injection",
        "https://img.shields.io/npm/v/ts-injection.svg",
        "npm version",
      ],
      [
        "https://bundlephobia.com/result?p=ts-injection",
        "https://img.shields.io/bundlephobia/minzip/ts-injection.svg",
        "minzip size",
      ],
      ["#", "https://img.shields.io/badge/license-MIT-blue.svg", "MIT license"],
      [
        "#",
        "https://img.shields.io/badge/PRs-welcome-brightgreen.svg",
        "pr's welcome",
      ],
    ],
    []
  );

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginBottom: "2em" }}
    >
      <ul style={{ listStyle: "none" }}>
        {badgeInfo.map(([href, src, alt]) => (
          <li style={{ display: "inline", paddingRight: "5px" }}>
            <a href={href}>
              <img src={src} alt={alt} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Badges;
