interface Section {
  _id: string;
  name: string;
  description: string;
  items: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export default Section;
