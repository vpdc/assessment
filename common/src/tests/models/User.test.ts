import { DateTime } from 'luxon';
import { User } from '../../models/User';

describe("User", () => {
  const user = new User({
    id: "63972a91-0496-4a61-8943-917b7b03718f",
    first_name: "Sanford",
    last_name: "Waelchi",
    birthday: "2006-10-05",
    timezone: "America/Indiana/Petersburg",
    created_at: DateTime.now().minus({ years: 5 }).toString(),
  })

  describe("fullName", () => {
    it('Should return the first name and the last name combined', () => {
      expect(user.fullName).toEqual("Sanford Waelchi");
    })
  });
  describe("birthDate", () => {
    it('Should return a DateTime type of the birthday string from the record', () => {
      expect(user.birthDate).toBeInstanceOf(DateTime)
    })
  });
  describe("joiningDate", () => {
    it("Should return a DateTime type of the created_at string from the record", () => {
      expect(user.joiningDate).toBeInstanceOf(DateTime);
    });
  });
  describe("anniversaryOrdinal", () => {
    it("Should return 5 years as the anniversary ordinal", () => {
      expect(user.anniversaryOrdinal).toEqual('5th');
    });
  });
});
