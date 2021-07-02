import React from "react";
import User from "../User";
import { shallow } from "enzyme";

jest.mock("../components/Stats", () => ({ props }) => <span></span>);

const setup = (stats) => {
  User.prototype.componentDidMount = () => null;
  const wrapper = shallow(<User />);

  return {
    wrapper,
    instance: wrapper.instance(),
  };
};

describe("Testing whole User page", () => {
  const { instance } = setup();
  test("Test 1: Testing calculateChartData() function", () => {
    instance.calculateChartData([{ time: 1000, speed: 200 }], "");

    instance.calculateChartData(
      [
        { time: 1000, speed: 50 },
        { time: 1100, speed: 100 },
        { time: 1300, speed: 30 },
      ],
      "?context=Multiplayer"
    );

    instance.calculateChartData(
      [
        { time: 100, speed: 80 },
        { time: 101, speed: 60 },
        { time: 90000, speed: 70 },
        { time: 90001, speed: 30 },
        { time: 176400, speed: 20 },
        { time: 176401, speed: 40 },
      ],
      "?context=Solo"
    );

    const dates = [new Date(101000), new Date(90001000), new Date(176401000)];

    const { wpm_data_all, wpm_data_multiplayer, wpm_data_solo } =
      instance.state;

    /*console.log(wpm_data_all);
    console.log(wpm_data_multiplayer);
    console.log(wpm_data_solo);
    console.log(dates);*/

    expect(wpm_data_all.length).toEqual(1);
    expect(wpm_data_all[0]["x"].getDate()).toEqual(dates[0].getDate());
    expect(wpm_data_all[0]["y"]).toEqual(200);

    expect(wpm_data_multiplayer.length).toEqual(1);
    expect(wpm_data_multiplayer[0]["x"].getDate()).toEqual(dates[0].getDate());
    expect(wpm_data_multiplayer[0]["y"]).toEqual(60);

    expect(wpm_data_solo.length).toEqual(3);
    expect(wpm_data_solo[0]["x"].getDate()).toEqual(dates[2].getDate());
    expect(wpm_data_solo[0]["y"]).toEqual(30);
    expect(wpm_data_solo[1]["x"].getDate()).toEqual(dates[1].getDate());
    expect(wpm_data_solo[1]["y"]).toEqual(40);
    expect(wpm_data_solo[2]["x"].getDate()).toEqual(dates[0].getDate());
    expect(wpm_data_solo[2]["y"]).toEqual(50);
  });
});
