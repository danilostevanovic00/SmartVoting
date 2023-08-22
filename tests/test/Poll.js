const { expect } = require("chai");

describe("Poll", function () {
  let poll;

  beforeEach(async function () {
    const Poll = await ethers.getContractFactory("Poll");
    poll = await Poll.deploy();
  });

  it("treba dodati opciju", async function () {
    await poll.addOption("Option_1");
    const optionsLength = await poll.getOptionsLength();
    expect(optionsLength).to.equal(1, "Netačan broj opcija");
  });

  it("treba glasati za opciju", async function () {
    await poll.addOption("Option_1");
    await poll.vote(0);
   
    const votes = await poll.votes(0);
    expect(votes).to.equal(1, "Netačan broj glasova za opciju");
  });

  it("treba sprečiti višestruke glasove sa iste adrese", async function () {
    await poll.addOption("Option_1");
    await poll.vote(0);

    let success = false;
    try {
      await poll.vote(0);
      success = true;
    } catch (error) {
      expect(error.message).to.include("Address has already voted.");
    }

    expect(success).to.equal(false, "Korisnik je mogao da glasa više puta za istu opciju");
  });

  it("treba prebrojati glasove i proglasiti pobednika", async function () {
    await poll.addOption("Option_1");
    await poll.addOption("Option_2");
    await poll.vote(0);

    await poll.countVotesAndDeclareWinner();
    poll.on('WinnerDeclared', (winningOptionId) => {
      expect(winningOptionId).to.equal(0);
    });
  });
});
