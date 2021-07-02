import React from "react";
import Stats from "../components/Stats";
import { shallow } from "enzyme";

jest.mock("../components/ProgressChart", () => ({ props }) => <span></span>);

const setup = (stats) => {
  const wrapper = shallow(
    <Stats wpm_data={[{ x: new Date(0), y: 0 }]} stats={stats} />
  );

  return {
    wrapper,
    rows: wrapper.find(".mt-1"),
    stats: ["2", "3", "4", "5"].map((str) => wrapper.find("#stat" + str)),
  };
};

describe("Testing Stats component in User page", () => {
  test("Test 1: Testing very low stats with only 7 stats", () => {
    const { stats, rows } = setup([0, 0, 0, 39, 0, 79, 1]);

    for (const stat of stats) {
      expect(stat.prop("style")).toHaveProperty("color", "#ff1a1a");
    }

    expect(stats[0].text()).toContain("WPM");
    expect(stats[1].text()).toContain("WPM");
    expect(stats[2].text()).toContain("%");
    expect(stats[3].text()).toContain("%");

    expect(rows.length).toEqual(7);
  });

  test("Test 2: Testing low stats with 8 stats", () => {
    const { stats, rows } = setup([0, 0, 40, 59.9, 80, 89.99, 1, 1]);
    for (const stat of stats) {
      expect(stat.prop("style")).toHaveProperty("color", "#ffaa00");
    }

    expect(rows.length).toEqual(8);
  });

  test("Test 3: Testing medium stats", () => {
    const { stats } = setup([0, 0, 60, 79.9, 90, 94.99, 1, 1]);
    for (const stat of stats) {
      expect(stat.prop("style")).toHaveProperty("color", "#e6e600");
    }
  });

  test("Test 4: Testing high stats", () => {
    const { stats } = setup([0, 0, 80, 99.9, 95, 98.99, 1, 1]);
    for (const stat of stats) {
      expect(stat.prop("style")).toHaveProperty("color", "#00e64d");
    }
  });

  test("Test 5: Testing very high stats", () => {
    const { stats } = setup([0, 0, 100, 600, 99, 100, 1, 1]);
    for (const stat of stats) {
      expect(stat.prop("style")).toHaveProperty("color", "#00ffff");
    }
  });
});
