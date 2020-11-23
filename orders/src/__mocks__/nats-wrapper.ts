// Used for faking files with JEST Test suiite

//Can use jest.fn() as a MOCK FUNCTION and jest will keep track of when it was called and what aruguments were passed in.
//We can add expectations to this
export const natsWrapper = {
  client: {
    publish: jest.fn().mockImplementation((subject: string, data: string, callback: ()=> void) => {
      callback();
    })
  },
};