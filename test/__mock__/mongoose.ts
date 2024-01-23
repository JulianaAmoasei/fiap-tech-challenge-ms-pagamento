const mockFindOne = jest.fn();

const mockMongoose = {
  model: jest.fn(() => ({ findOne: mockFindOne })),
};

mockFindOne.mockResolvedValue(null);

export default mockMongoose;