import Availability from "../enums/Availability";
import Color from "../enums/Color";
import Product from "../models/Product";
import Season from "../enums/Season";

export const sampleProducts: Product[] = [
  {
    _id: "product1",
    productName: "Winter Jacket",
    productDescription: "A warm winter jacket perfect for cold weather.",
    colors: [
      {
        name: Color.BLACK,
        availableSizes: [
          {
            _id: "size1",
            name: "M",
            quantity: 10,
            sizeAvailability: Availability.IN_STOCK,
          },
          {
            _id: "size2",
            name: "L",
            quantity: 5,
            sizeAvailability: Availability.IN_STOCK,
          },
        ],
      },
      {
        name: Color.RED,
        availableSizes: [
          {
            _id: "size3",
            name: "S",
            quantity: 8,
            sizeAvailability: Availability.IN_STOCK,
          },
          {
            _id: "size4",
            name: "M",
            quantity: 6,
            sizeAvailability: Availability.IN_STOCK,
          },
        ],
      },
    ],
    isUnisex: true,
    season: [Season.Winter],
    woolPercentage: 70,
    price: 120,
    releaseDate: new Date("2024-01-10"),
    images: [
      {
        pathname: "/images/winter-jacket-front.jpg",
        angle: "front",
        _id: "img1",
      },
      {
        pathname: "/images/winter-jacket-side.jpg",
        angle: "side",
        _id: "img2",
      },
    ],
    availability: Availability.IN_STOCK,
  },
  {
    _id: "product2",
    productName: "Summer Dress",
    productDescription: "A light and breezy summer dress for hot days.",
    colors: [
      {
        name: Color.YELLOW,
        availableSizes: [
          {
            _id: "size5",
            name: "S",
            quantity: 15,
            sizeAvailability: Availability.IN_STOCK,
          },
          {
            _id: "size6",
            name: "M",
            quantity: 12,
            sizeAvailability: Availability.IN_STOCK,
          },
        ],
      },
    ],
    isUnisex: false,
    season: [Season.Summer],
    price: 60,
    releaseDate: new Date("2024-03-05"),
    images: [
      {
        pathname: "/images/summer-dress-front.jpg",
        angle: "front",
        _id: "img3",
      },
    ],
    availability: Availability.IN_STOCK,
  },
  {
    _id: "product3",
    productName: "Spring Jacket",
    productDescription: "A lightweight jacket perfect for spring weather.",
    colors: [
      {
        name: Color.GREEN,
        availableSizes: [
          {
            _id: "size7",
            name: "S",
            quantity: 0,
            sizeAvailability: Availability.OUT_OF_STOCK,
          },
          {
            _id: "size8",
            name: "M",
            quantity: 20,
            sizeAvailability: Availability.IN_STOCK,
          },
        ],
      },
      {
        name: Color.BLUE,
        availableSizes: [
          {
            _id: "size9",
            name: "M",
            quantity: 10,
            sizeAvailability: Availability.COMING_SOON,
          },
          {
            _id: "size10",
            name: "L",
            quantity: 15,
            sizeAvailability: Availability.IN_STOCK,
          },
        ],
      },
    ],
    isUnisex: true,
    season: [Season.Spring],
    price: 80,
    releaseDate: new Date("2024-02-15"),
    images: [
      {
        pathname: "/images/spring-jacket-front.jpg",
        angle: "front",
        _id: "img4",
      },
    ],
    availability: Availability.COMING_SOON,
  },
  {
    _id: "product4",
    productName: "Autumn Sweater",
    productDescription: "A cozy sweater perfect for autumn.",
    colors: [
      {
        name: Color.ORANGE,
        availableSizes: [
          {
            _id: "size11",
            name: "S",
            quantity: 5,
            sizeAvailability: Availability.DISCOUNTED,
          },
          {
            _id: "size12",
            name: "M",
            quantity: 8,
            sizeAvailability: Availability.IN_STOCK,
          },
        ],
      },
      {
        name: Color.BROWN,
        availableSizes: [
          {
            _id: "size13",
            name: "L",
            quantity: 2,
            sizeAvailability: Availability.UNAVAILABLE,
          },
          {
            _id: "size14",
            name: "XL",
            quantity: 0,
            sizeAvailability: Availability.OUT_OF_SEASON,
          },
        ],
      },
    ],
    isUnisex: false,
    season: [Season.Autumn],
    price: 100,
    releaseDate: new Date("2024-09-01"),
    images: [
      {
        pathname: "/images/autumn-sweater-front.jpg",
        angle: "front",
        _id: "img5",
      },
    ],
    availability: Availability.DISCOUNTED,
  },
];
