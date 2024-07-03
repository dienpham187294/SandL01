import { Link } from "react-router-dom";
// import { useState, useEffect } from "react";
// import T0_linkApi from "../ulti/T0_linkApi";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

const pracEnSets = [
  {
    root: "learninghub",
    preName: "Khóa Sơ cấp:",
    name: "Cùng thực hành nghe nói 10 chủ đề giao tiếp cơ bản",
    link: "elementary-a1-lesson-plan",
    id: "socapI",
  },
  {
    root: "learninghub",
    preName: "Khóa tiêu chuẩn:",
    name: "Cùng thực hành nghe nói chủ đề: Ăn - Ở - Đi lại",
    link: "restaurant-hotel-travel",
    id: "socapII",
  },
];

export default function Header({ sttRoom, STTconnectFN }) {
  if (sttRoom) {
    return null;
  }
  return (
    <div>
      <div>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand>
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "black",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src="https://i.postimg.cc/vB1qBy2X/logo-N.png"
                width={60}
                style={{ marginRight: 10 }} // Khoảng cách bên phải cho hình ảnh logo
                alt="Logo"
              />
              <b style={{ fontSize: 18, fontWeight: "bold" }}>
                <i style={{ color: "blue", fontStyle: "italic" }}>
                  {" "}
                  Cùng thực hành
                </i>
              </b>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {returnDropdown(
                "Giáo án giao tiếp",
                pracEnSets,
                { name: "name", link: "link", preName: "preName" },
                null
              )}
              {returnDropdown(
                "ESL Conversation: Q&A Collection",
                NewListHref,
                { name: "name", link: "link", preName: "preName" },
                null
              )}
              {returnDropdown(
                "Khác",
                [
                  {
                    name: "Cấu hình cài đặt",
                    root: "setting",
                    link: "",
                    preName: "",
                  },
                ],
                { name: "name", link: "link" },
                null
              )}
            </Nav>
            {/* <Move /> */}
          </Navbar.Collapse>
        </Navbar>
      </div>
    </div>
  );
}

function returnDropdown(name, inputSets, keysSets, link) {
  return (
    <NavDropdown title={name} id="basic-nav-dropdown">
      {inputSets.map((e, i) =>
        (() => {
          const urlPath =
            e.root !== null
              ? `/${e.root}/` + e[keysSets.link]
              : `/${e[keysSets.link]}`;
          return (
            <NavDropdown.Item key={i} as={Link} to={urlPath}>
              {e[keysSets.preName] ? (
                <span
                  style={{
                    width: "150px",
                    borderBottom: "1px solid black",
                    display: "inline-block",
                  }}
                >
                  <i>{e[keysSets.preName]}</i>
                </span>
              ) : null}
              {"  "} {e[keysSets.name]}
            </NavDropdown.Item>
          );
        })()
      )}
    </NavDropdown>
  );
}
const NewListHref = [
  {
    root: "learninghub",
    preName: "",
    name: 'Pets Guide: "20 Bộ câu hỏi & Trả lời | The Ultimate Guide to Pets: Benefits, Care, and Responsibilities"',
    link: "az0-comprehensive-pet-care-guide",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Birthday Celebrations: "20 Bộ câu hỏi & Trả lời | The Ultimate Guide to Celebrating Birthdays: Traditions, Ideas, and Memories"',
    link: "az1-ultimate-guide-to-birthdays",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Cars and Driving: "20 Bộ câu hỏi & Trả lời | Mastering the Road: A Comprehensive Guide to Cars and Driving"',
    link: "az2-comprehensive-guide-to-cars-and-driving",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'City Living: "20 Bộ câu hỏi & Trả lời | City Living: Exploring the Advantages and Challenges"',
    link: "az3-exploring-city-living",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Power of Colors: "20 Bộ câu hỏi & Trả lời | The Power of Colors: How They Influence Our Lives and Emotions"',
    link: "az4-exploring-colors-meanings-effects",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Exploring Countries: "20 Bộ câu hỏi & Trả lời | Exploring the World: Top Countries to Visit, Live, and Work In"',
    link: "az5-exploring-the-world-best-countries",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Dogs vs. Cats: "20 Bộ câu hỏi & Trả lời | Comparing Dogs and Cats as Pets: Preferences, Benefits, and Considerations"',
    link: "az6-comparing-dogs-cats-pets",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Family Dynamics: "20 Bộ câu hỏi & Trả lời | Exploring Family Dynamics: Perspectives and Insights"',
    link: "az7-exploring-family-dynamics",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Food Preferences: "19 Bộ câu hỏi & Trả lời | Exploring Food Preferences and Eating Habits"',
    link: "az8-exploring-food-preferences-and-eating-habits",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Friendships: "19 Bộ câu hỏi & Trả lời | Exploring Friendships: Bonds That Shape Lives"',
    link: "az9-exploring-friendships",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Fruits and Vegetables: "20 Bộ câu hỏi & Trả lời | Exploring the World of Fruits and Vegetables"',
    link: "az10-exploring-fruits-and-vegetables",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Christmas Traditions: "20 Bộ câu hỏi & Trả lời | Christmas Traditions and Celebrations Around the World"',
    link: "az11-christmas-traditions-celebrations",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Homes and Living Spaces: "20 Bộ câu hỏi & Trả lời | Exploring Homes and Living Spaces: Insights and Comparisons"',
    link: "az12-exploring-homes-and-living-spaces",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Hometowns: "20 Bộ câu hỏi & Trả lời | Exploring Hometowns: Personal Connections and Cultural Significance"',
    link: "az13-exploring-hometowns",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Advertising: "20 Bộ câu hỏi & Trả lời | The Power of Advertising: Insights and Impacts"',
    link: "az14-understanding-power-of-advertising",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Everyday Problems: "20 Bộ câu hỏi & Trả lời | Effective Solutions for Everyday Problems: Expert Advice"',
    link: "az15-expert-advice-solutions",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Air Travel: "20 Bộ câu hỏi & Trả lời | The Fascinating World of Air Travel: Experiences and Insights"',
    link: "az16-explore-world-of-air-travel",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Amusement Parks: "19 Bộ câu hỏi & Trả lời | Exploring the Thrills of Amusement Parks: Best Rides and Tips"',
    link: "az17-ultimate-guide-to-amusement-parks",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Managing Anger: "20 Bộ câu hỏi & Trả lời | Mastering Anger: Effective Strategies for Managing Emotions"',
    link: "az18-effective-anger-management",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Everyday Annoyances: "20 Bộ câu hỏi & Trả lời | Effective Strategies to Handle Everyday Annoyances"',
    link: "az19-dealing-with-everyday-annoyances",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Constructive Arguing: "20 Bộ câu hỏi & Trả lời | Mastering the Art of Constructive Arguing: Tips and Techniques"',
    link: "az20-constructive-arguing-tips",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Beach Guide: "20 Bộ câu hỏi & Trả lời | Ultimate Beach Guide: Enjoyment, Safety, and Eco-Friendly Practices"',
    link: "az21-ultimate-beach-guide",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Beauty and Attractiveness: "20 Bộ câu hỏi & Trả lời | Exploring Beauty and Physical Attractiveness: Perceptions and Impacts"',
    link: "az22-exploring-beauty-and-physical-attractiveness",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Understanding Behavior: "20 Bộ câu hỏi & Trả lời | Understanding Behavior: Importance, Influences, and Improvement"',
    link: "az23-understanding-behavior-guide",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Body Language: "20 Bộ câu hỏi & Trả lời | Mastering Body Language: Enhance Your Communication Skills"',
    link: "az24-mastering-body-language",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Joy of Books: "20 Bộ câu hỏi & Trả lời | The Joy of Books: Exploring the World of Reading"',
    link: "az25-discover-joy-of-books",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'World of Celebrities: "20 Bộ câu hỏi & Trả lời | The Fascinating World of Celebrities: Fame, Privacy, and Influence"',
    link: "az26-understanding-celebrities",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Embracing Change: "20 Bộ câu hỏi & Trả lời | Embracing Change: How It Shapes Our Lives and Futures"',
    link: "az27-embracing-change",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Childhood Memories: "20 Bộ câu hỏi & Trả lời | Exploring Childhood Memories: Joys, Lessons, and Growth"',
    link: "az28-exploring-childhood-memories",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Supporting Children: "20 Bộ câu hỏi & Trả lời | Nurturing the Future: Understanding and Supporting Children\'s Development"',
    link: "az29-nurturing-children-development",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Household Chores: "20 Bộ câu hỏi & Trả lời | Mastering Household Chores: Tips for Efficient and Fair Distribution"',
    link: "az30-mastering-household-chores",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Classroom Environments: "20 Bộ câu hỏi & Trả lời | Optimizing Classroom Environments for Effective Learning"',
    link: "az31-optimizing-classroom-environments",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Fashion Trends: "20 Bộ câu hỏi & Trả lời | Fashion Trends: Understanding the Influence of Clothes and Style"',
    link: "az32-exploring-fashion-trends",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'College Life: "20 Bộ câu hỏi & Trả lời | Navigating College Life: Experiences, Challenges, and Growth"',
    link: "az33-navigating-college-life",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Building Communities: "20 Bộ câu hỏi & Trả lời | Building Strong Communities: The Importance of Connection and Support"',
    link: "az34-building-strong-communities",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Impact of Commuting: "20 Bộ câu hỏi & Trả lời | The Impact of Commuting: Exploring Benefits and Challenges"',
    link: "az35-understanding-commuting-impact",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Art of Complaining: "20 Bộ câu hỏi & Trả lời | The Art of Complaining: When and How to Voice Your Concerns Effectively"',
    link: "az36-mastering-the-art-of-complaining",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Digital World: "20 Bộ câu hỏi & Trả lời | Exploring the Digital World: The Importance of Computers in Modern Life"',
    link: "az37-importance-of-computers",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Exploring Culture: "20 Bộ câu hỏi & Trả lời | Exploring Culture: Understanding and Appreciating Diverse Traditions"',
    link: "az38-understanding-culture",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Exploring Dating: "20 Bộ câu hỏi & Trả lời | Exploring Dating: Perspectives on Relationships and Connections"',
    link: "az39-exploring-dating-relationships-connections",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Wishes and Desires: "20 Bộ câu hỏi & Trả lời | Exploring Wishes and Desires: Reflecting on Personal Choices and Aspirations"',
    link: "az40-exploring-wishes-desires",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Exploring Dreams: "20 Bộ câu hỏi & Trả lời | Exploring Dreams: Insights into the World of Dreaming"',
    link: "az41-exploring-dreams-insights",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Easter Traditions: "20 Bộ câu hỏi & Trả lời | Exploring Easter Traditions and Meaning"',
    link: "az42-exploring-easter-traditions",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Personal Education Journey: "20 Bộ câu hỏi & Trả lời | Exploring Personal Education Journey and Reflections"',
    link: "az43-personal-education-journey",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Finding Encouragement: "20 Bộ câu hỏi & Trả lời | Finding Encouragement and Inspiration in Life"',
    link: "az44-finding-encouragement-inspiration",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Study of English Language: "20 Bộ câu hỏi & Trả lời | Exploring the Study of English Language"',
    link: "az45-exploring-study-english-language",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Entertainment Choices: "20 Bộ câu hỏi & Trả lời | Exploring Entertainment Choices"',
    link: "az46-exploring-entertainment-choices",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Everyday Questions: "20 Bộ câu hỏi & Trả lời | Common Everyday Questions"',
    link: "az47-common-everyday-questions",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Eye Contact: "20 Bộ câu hỏi & Trả lời | Understanding Eye Contact in Communication"',
    link: "az48-understanding-eye-contact",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Facebook and Privacy: "20 Bộ câu hỏi & Trả lời | Exploring Facebook: Social Networking and Privacy"',
    link: "az49-exploring-facebook-social-networking",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Fads and Trends: "20 Bộ câu hỏi & Trả lời | Exploring Fads and Trends: Influence and Evolution"',
    link: "az50-exploring-fads-and-trends",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Exploring Fame: "20 Bộ câu hỏi & Trả lời | Exploring Fame: Insights and Perspectives"',
    link: "az51-exploring-fame-insights-perspectives",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Fashion Trends: "20 Bộ câu hỏi & Trả lời | Exploring Fashion: Trends and Personal Style"',
    link: "az52-exploring-fashion-trends-personal-style",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Personal Preferences: "20 Bộ câu hỏi & Trả lời | Exploring Favorites: Personal Preferences and Meaningful Choices"',
    link: "az53-exploring-favorites-personal-preferences",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Common Phobias: "20 Bộ câu hỏi & Trả lời | Exploring Fears: Understanding Common Phobias and Anxiety Triggers"',
    link: "az54-exploring-fears-common-phobias",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Emotional Responses: "20 Bộ câu hỏi & Trả lời | Understanding Emotional Responses: An Exploration of Feelings and Reactions"',
    link: "az55-understanding-emotional-responses-feelings-reactions",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Films in Your Language: "19 Bộ câu hỏi & Trả lời | Exploring Films in Your Own Language: Cultural Impact and Global Presence"',
    link: "az56-exploring-films-in-your-own-language-cultural-impact",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'First Date Tips: "13 Bộ câu hỏi & Trả lời | First Date Etiquette and Tips"',
    link: "az57-first-date-etiquette-and-tips",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Free Time and Hobbies: "20 Bộ câu hỏi & Trả lời | Exploring Free Time and Hobbies: How People Spend Their Leisure"',
    link: "az58-exploring-free-time-and-hobbies",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Future Trends: "20 Bộ câu hỏi & Trả lời | Exploring the Future: Trends and Innovations"',
    link: "az59-exploring-the-future-trends-innovations",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Garage Sales: "20 Bộ câu hỏi & Trả lời | Exploring Garage Sales: Bargains and Treasures"',
    link: "az60-exploring-garage-sales-bargains-treasures",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Gardening: "20 Bộ câu hỏi & Trả lời | Exploring Gardening: Benefits and Techniques"',
    link: "az61-exploring-gardening-benefits-techniques",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Cultural Gestures: "20 Bộ câu hỏi & Trả lời | Exploring Gestures: Cultural Significance and Misinterpretations"',
    link: "az62-exploring-gestures-cultural-significance",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Getting to Know Each Other: "20 Bộ câu hỏi & Trả lời | Getting to Know Each Other: Insights into Personal Lives and Preferences"',
    link: "az63-getting-to-know-each-other-insights",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Gifts: "20 Bộ câu hỏi & Trả lời | Gifts: Giving, Receiving, and Cultural Significance"',
    link: "az64-gifts-giving-receiving-cultural-significance",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Setting Goals: "20 Bộ câu hỏi & Trả lời | Setting and Achieving Goals: Personal Growth and Success"',
    link: "az65-setting-achieving-goals-personal-growth-success",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Enjoying Parties: "20 Bộ câu hỏi & Trả lời | Enjoying Parties: Social Gatherings and Etiquette"',
    link: "az66-enjoying-parties-social-gatherings-etiquette",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Gossip and Rumors: "20 Bộ câu hỏi & Trả lời | Exploring Gossip and Rumors: Social Phenomenon and Impact"',
    link: "az67-exploring-gossip-and-rumors-social-phenomenon",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Understanding Habits: "20 Bộ câu hỏi & Trả lời | Exploring Habits: Understanding Behavior Patterns"',
    link: "az68-exploring-habits-understanding-behavior-patterns",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Understanding Happiness: "20 Bộ câu hỏi & Trả lời | Exploring Happiness: Understanding What Makes Us Happy"',
    link: "az69-exploring-happiness-understanding-what-makes-us-happy",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Life Experiences: "20 Bộ câu hỏi & Trả lời | Exploring Life Experiences: Have You Ever..."',
    link: "az70-exploring-life-experiences-have-you-ever",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Health and Wellness: "20 Bộ câu hỏi & Trả lời | Exploring Health and Wellness: Insights and Perspectives"',
    link: "az71-exploring-health-and-wellness-insights",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Healthy Lifestyle: "20 Bộ câu hỏi & Trả lời | Exploring the Benefits of a Healthy Lifestyle"',
    link: "az72-exploring-benefits-healthy-lifestyle",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Hobbies: "20 Bộ câu hỏi & Trả lời | Exploring the World of Hobbies"',
    link: "az73-exploring-world-hobbies",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Holiday Traditions: "20 Bộ câu hỏi & Trả lời | Exploring Holidays: Traditions and Celebrations"',
    link: "az74-exploring-holidays-traditions",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Cultural Holidays: "20 Bộ câu hỏi & Trả lời | Exploring Cultural Holidays: Traditions and Celebrations"',
    link: "az75-exploring-cultural-holidays",
  },
  {
    root: "learninghub",
    preName: "",
    name: "April Fool's Day: \"20 Bộ câu hỏi & Trả lời | April Fool's Day: History and Traditions of Prankster's Day\"",
    link: "az76-april-fools-day-history-traditions",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Halloween Traditions: "20 Bộ câu hỏi & Trả lời | Halloween Traditions and Celebrations"',
    link: "az77-halloween-traditions-celebrations",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Thanksgiving Traditions: "20 Bộ câu hỏi & Trả lời | Exploring Thanksgiving Traditions"',
    link: "az78-exploring-thanksgiving-traditions",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Last Vacation: "20 Bộ câu hỏi & Trả lời | Reflections on Your Last Vacation"',
    link: "az79-reflections-on-last-vacation",
  },
  {
    root: "learninghub",
    preName: "",
    name: "Valentine's Day: \"20 Bộ câu hỏi & Trả lời | Valentine's Day Celebrations Around the World\"",
    link: "az80-valentines-day-celebrations",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Homework Strategies: "20 Bộ câu hỏi & Trả lời | Effective Homework Strategies: Enhancing Learning Through Practice"',
    link: "az81-effective-homework-strategies",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Honesty and Truthfulness: "20 Bộ câu hỏi & Trả lời | Exploring Honesty and Truthfulness: Impact on Personal Integrity"',
    link: "az82-exploring-honesty-and-truthfulness",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Concept of Time: "20 Bộ câu hỏi & Trả lời | Exploring the Concept of Time: Its Significance in Personal and Social Contexts"',
    link: "az83-exploring-the-concept-of-time",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Frequency of Activities: "20 Bộ câu hỏi & Trả lời | Understanding the Frequency of Activities: Insights into Daily Routines"',
    link: "az84-frequency-of-activities",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Role of Humor: "20 Bộ câu hỏi & Trả lời | Understanding Humor: Its Role in Life and Relationships"',
    link: "az85-exploring-humor",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Event Planning: "20 Bộ câu hỏi & Trả lời | Effective Strategies for Event Planning: Weddings, Parties, and More"',
    link: "az86-effective-strategies-for-event-planning",
  },
  {
    root: "learninghub",
    preName: "",
    name: "Internet's Influence: \"19 Bộ câu hỏi & Trả lời | The Internet's Influence: Usage, Benefits, and Challenges\"",
    link: "az87-internet-influence-usage-benefits-challenges",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Jobs and Occupations: "20 Bộ câu hỏi & Trả lời | Understanding Jobs and Occupations: Trends, Challenges, and Personal Stories"',
    link: "az88-understanding-jobs-occupations-trends-stories",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Power of Humor: "12 Bộ câu hỏi & Trả lời | The Power of Humor: How Jokes Shape Our Social Interactions"',
    link: "az89-power-of-humor-jokes-social-interactions",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Embracing Multilingualism: "20 Bộ câu hỏi & Trả lời | Embracing Multilingualism: The Role of Languages in a Globalized World"',
    link: "az90-embracing-multilingualism-role-languages",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Learning a Foreign Language: "20 Bộ câu hỏi & Trả lời | Effective Strategies for Learning a Foreign Language"',
    link: "az91-effective-strategies-learning-foreign-language",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Journey Through Life: "20 Bộ câu hỏi & Trả lời | A Journey Through My Life: Key Memories and Valuable Lessons"',
    link: "az92-journey-through-life-memories-lessons",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Likes and Dislikes: "20 Bộ câu hỏi & Trả lời | Understanding Likes and Dislikes: A Dive into Personal Preferences"',
    link: "az93-understanding-likes-dislikes-personal-preferences",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Perfect Home: "20 Bộ câu hỏi & Trả lời | Creating Your Perfect Home: Insights into Dream Living Arrangements"',
    link: "az94-creating-your-perfect-home",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Love, Dating, and Marriage: "20 Bộ câu hỏi & Trả lời | Navigating Love, Dating, and Marriage: Key Insights and Perspectives"',
    link: "az95-navigating-love-dating-marriage",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Makeup and Skin Care: "20 Bộ câu hỏi & Trả lời | Mastering Makeup and Skin Care: Tips, Trends, and Techniques"',
    link: "az96-mastering-makeup-skin-care",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Manners and Etiquette: "20 Bộ câu hỏi & Trả lời | Mastering Manners: A Guide to Polite Behavior and Social Etiquette"',
    link: "az97-mastering-manners-guide-polite-behavior",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Navigating Marriage: "20 Bộ câu hỏi & Trả lời | Navigating Marriage: Traditions, Challenges, and Keys to Success"',
    link: "az98-navigating-marriage-traditions-challenges-success",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Meeting New People: "20 Bộ câu hỏi & Trả lời | Effective Strategies for Meeting New People and Building Connections"',
    link: "az99-effective-strategies-meeting-new-people",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Memory Enhancement: "20 Bộ câu hỏi & Trả lời | Unlocking the Secrets of Memory: How to Enhance and Preserve Your Memories"',
    link: "az100-enhancing-preserving-memories",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Achieving Wellness: "20 Bộ câu hỏi & Trả lời | Achieving Wellness: Effective Strategies for Balancing Mind, Body, and Health"',
    link: "az101-achieving-wellness-strategies",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Money and Shopping: "20 Bộ câu hỏi & Trả lời | Mastering Money and Shopping: Tips for Smart Financial Decisions"',
    link: "az102-mastering-money-and-shopping",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Harnessing Motivation: "20 Bộ câu hỏi & Trả lời | Harnessing Motivation: Key Strategies to Stay Driven and Achieve Goals"',
    link: "az103-harnessing-motivation-strategies-achieve-goals",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Cinema: "20 Bộ câu hỏi & Trả lời | Diving into Cinema: Favorite Films, Genres, and Viewing Preferences"',
    link: "az104-diving-into-cinema",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'World of Music: "20 Bộ câu hỏi & Trả lời | Exploring the World of Music: Personal Preferences and Emotional Benefits"',
    link: "az105-exploring-world-of-music",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Meaning of Names: "20 Bộ câu hỏi & Trả lời | Exploring the Meaning and Impact of Names on Personal Identity"',
    link: "az106-exploring-meaning-and-impact-of-names",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Managing Neighbor Complaints: "20 Bộ câu hỏi & Trả lời | Effective Strategies for Managing Neighbor Complaints and Building Strong Relationships"',
    link: "az107-managing-neighbor-complaints",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Enhancing Neighborhoods: "20 Bộ câu hỏi & Trả lời | Enhancing Neighborhoods: Benefits, Challenges, and Community Engagement"',
    link: "az108-enhancing-neighborhoods",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Impact of News: "20 Bộ câu hỏi & Trả lời | Understanding the Impact of News: The Role, Evolution, and Future of Journalism"',
    link: "az109-impact-of-news-role-evolution-future",
  },
  {
    root: "learninghub",
    preName: "",
    name: "New Year's Day: \"20 Bộ câu hỏi & Trả lời | Exploring New Year's Day: Traditions, Resolutions, and Family Activities\"",
    link: "az110-exploring-new-years-day",
  },
  {
    root: "learninghub",
    preName: "",
    name: "New Year's Resolutions: \"20 Bộ câu hỏi & Trả lời | Making and Keeping New Year's Resolutions: Tips for Success\"",
    link: "az111-making-keeping-new-years-resolutions",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Dreams and Nightmares: "20 Bộ câu hỏi & Trả lời | Exploring Dreams, Daydreams, and Nightmares: Insights and Meanings"',
    link: "az112-exploring-dreams-daydreams-nightmares",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Body Care: "20 Bộ câu hỏi & Trả lời | Caring for Your Body: Essential Tips for Health and Wellness"',
    link: "az113-caring-for-your-body-health-wellness-tips",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Parenting Tips: "20 Bộ câu hỏi & Trả lời | Parenting Tips: Navigating Challenges and Celebrating Successes"',
    link: "az114-parenting-tips-navigating-challenges-celebrating-successes",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Hosting Parties: "20 Bộ câu hỏi & Trả lời | The Ultimate Guide to Hosting and Enjoying Parties: Tips and Etiquette"',
    link: "az115-guide-to-hosting-and-enjoying-parties",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Planning Parties: "20 Bộ câu hỏi & Trả lời | The Ultimate Guide to Planning the Perfect Party"',
    link: "az116-planning-the-perfect-party",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Personality Traits: "20 Bộ câu hỏi & Trả lời | Understanding and Improving Your Personality Traits"',
    link: "az117-understanding-improving-personality-traits",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Effective Planning: "20 Bộ câu hỏi & Trả lời | Mastering Effective Planning: Strategies for Success"',
    link: "az118-effective-planning-strategies",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Value of Possessions: "20 Bộ câu hỏi & Trả lời | Understanding the True Value of Our Possessions"',
    link: "az119-value-of-possessions",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Procrastination: "20 Bộ câu hỏi & Trả lời | Why Procrastination Happens and How to Overcome It"',
    link: "az120-overcoming-procrastination",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Home Renovation: "20 Bộ câu hỏi & Trả lời | Unlock the Potential of Your Home with Renovation"',
    link: "az121-home-renovation-transforming-living-space",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Dining Out: "20 Bộ câu hỏi & Trả lời | Discover the Joy of Dining Out: Tips and Insights"',
    link: "az122-restaurants-eating-out-tips-insights",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Home and Personal Safety: "20 Bộ câu hỏi & Trả lời | Top Tips for Home and Personal Safety"',
    link: "az123-home-personal-safety-tips",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'School Life: "20 Bộ câu hỏi & Trả lời | Exploring School Life: From Rules to Activities"',
    link: "az124-school-life-rules-activities-experiences",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Secrets: "20 Bộ câu hỏi & Trả lời | The Intricacies of Secrets: Trust, Privacy, and Ethics"',
    link: "az125-intricacies-of-secrets",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Silly Questions: "20 Bộ câu hỏi & Trả lời | Exploring the Fun World of Silly Questions"',
    link: "az126-exploring-fun-world-silly-questions",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Single Life: "20 Bộ câu hỏi & Trả lời | Exploring the Single Life: Benefits and Perspectives"',
    link: "az127-exploring-single-life-benefits-perspectives",
  },
  {
    root: "learninghub",
    preName: "",
    name: "Good Night's Sleep: \"20 Bộ câu hỏi & Trả lời | Unlocking the Secrets to a Good Night's Sleep\"",
    link: "az128-secrets-to-good-sleep",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Social Networking: "20 Bộ câu hỏi & Trả lời | The Impact of Social Networking on Modern Life"',
    link: "az129-impact-of-social-networking",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Sports and Physical Activities: "20 Bộ câu hỏi & Trả lời | The Benefits of Sports and Physical Activities"',
    link: "az130-benefits-of-sports",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Stress Management: "20 Bộ câu hỏi & Trả lời | Effective Stress Management Techniques"',
    link: "az131-effective-stress-management-techniques",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Home Safety Guide: "20 Bộ câu hỏi & Trả lời | Comprehensive Guide to Home Safety: Preventing Accidents for All Ages"',
    link: "az132-home-safety-guide",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Adoption: "20 Bộ câu hỏi & Trả lời | Exploring Adoption: Benefits, Processes, and Cultural Perspectives"',
    link: "az133-comprehensive-guide-to-adoption",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Aging: "20 Bộ câu hỏi & Trả lời | Embracing All Ages: Insights into Youth and Old Age"',
    link: "az134-youth-and-old-age-insights",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Impact of Art: "20 Bộ câu hỏi & Trả lời | The Impact of Art on Society: Exploring Creativity and Culture"',
    link: "az135-impact-of-art-on-society",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Conversation Skills: "20 Bộ câu hỏi & Trả lời | Mastering the Art of Conversation: Tips for Engaging and Effective Communication"',
    link: "az136-mastering-art-of-conversation",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Guide to Bags: "20 Bộ câu hỏi & Trả lời | Ultimate Guide to Bags and Purses: Trends, Care, and Selection Tips"',
    link: "az137-guide-to-bags-and-purses",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Baseball Guide: "20 Bộ câu hỏi & Trả lời | A Comprehensive Guide to Baseball: Rules, History, and Tips"',
    link: "az138-comprehensive-guide-to-baseball",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Basketball Guide: "20 Bộ câu hỏi & Trả lời | A Comprehensive Guide to Basketball: Rules, History, and Training Tips"',
    link: "az139-comprehensive-guide-to-basketball",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Building Business: "20 Bộ câu hỏi & Trả lời | Building a Successful Business: Strategies, Challenges, and Innovations"',
    link: "az140-building-successful-business",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Impact of Charity: "20 Bộ câu hỏi & Trả lời | The Power of Giving: Exploring the Impact of Charity Work"',
    link: "az141-exploring-charity-impact",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Understanding Cheating: "20 Bộ câu hỏi & Trả lời | Understanding Cheating: Causes, Consequences, and Prevention"',
    link: "az142-understanding-cheating",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Childbirth Journey: "20 Bộ câu hỏi & Trả lời | The Journey of Childbirth: Experiences, Challenges, and Support"',
    link: "az143-understanding-childbirth",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'World of Comics: "20 Bộ câu hỏi & Trả lời | The World of Comics: Exploring Genres, Styles, and Cultural Impact"',
    link: "az144-exploring-world-of-comics",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Understanding Conflict: "20 Bộ câu hỏi & Trả lời | Understanding Conflict: Causes, Effects, and Resolution Strategies"',
    link: "az145-understanding-conflict",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Understanding Corruption: "20 Bộ câu hỏi & Trả lời | Understanding Corruption: Causes, Impact, and Prevention"',
    link: "az146-understanding-corruption",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Unlocking Creativity: "20 Bộ câu hỏi & Trả lời | Unlocking Creativity: Understanding and Nurturing Creative Potential"',
    link: "az147-understanding-creativity",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Understanding Crime: "20 Bộ câu hỏi & Trả lời | Understanding Crime: Causes, Impact, and Prevention"',
    link: "az148-understanding-crime",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Understanding Risks: "20 Bộ câu hỏi & Trả lời | Navigating Dangers: Understanding Risks and Precautions"',
    link: "az149-navigating-dangers-understanding-risks-precautions",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Death and Dying: "20 Bộ câu hỏi & Trả lời | Exploring Death & Dying: Perspectives on Mortality and End-of-Life Matters"',
    link: "az150-exploring-death-and-dying-perspectives",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Exploring Diets: "20 Bộ câu hỏi & Trả lời | Exploring Diets: Perspectives on Health, Nutrition, and Weight Management"',
    link: "az151-exploring-diets-perspectives",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Understanding Disabilities: "20 Bộ câu hỏi & Trả lời | Understanding Disabilities: Perspectives and Contributions to Society"',
    link: "az152-understanding-disabilities-perspectives",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Understanding Disasters: "20 Bộ câu hỏi & Trả lời | Understanding Disasters: Preparedness and Community Response"',
    link: "az153-understanding-disasters-preparedness",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Disaster Preparedness: "20 Bộ câu hỏi & Trả lời | Disaster Preparedness: Essential Tips and Advice"',
    link: "az154-disaster-preparedness-tips",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Understanding Discrimination: "20 Bộ câu hỏi & Trả lời | Understanding Discrimination: Causes, Effects, and Solutions"',
    link: "az155-understanding-discrimination",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Understanding Drugs: "20 Bộ câu hỏi & Trả lời | Understanding Drugs: Impact and Perspectives"',
    link: "az156-understanding-drugs-impact",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'English Literature: "20 Bộ câu hỏi & Trả lời | Exploring English Literature and Its Impact"',
    link: "az157-exploring-english-literature",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Environmental Concerns: "20 Bộ câu hỏi & Trả lời | Exploring Environmental Concerns"',
    link: "az158-exploring-environmental-concerns",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Faith and Faithfulness: "20 Bộ câu hỏi & Trả lời | Exploring Faith and Faithfulness: Perspectives and Impact"',
    link: "az159-exploring-faith-and-faithfulness",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Alternative Lifestyles: "20 Bộ câu hỏi & Trả lời | Exploring Family & Alternative Lifestyles: Perspectives and Insights"',
    link: "az160-exploring-family-alternative-lifestyles",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Fire Safety Tips: "12 Bộ câu hỏi & Trả lời | Essential Fire Safety Tips and Preparedness"',
    link: "az161-essential-fire-safety-tips-and-preparedness",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Gambling: "20 Bộ câu hỏi & Trả lời | Exploring Gambling: Risks and Rewards"',
    link: "az162-exploring-gambling-risks-rewards",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Gay Community: "20 Bộ câu hỏi & Trả lời | Understanding the Gay Community: Perspectives and Challenges"',
    link: "az163-understanding-gay-community-perspectives-challenges",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Gender Roles: "20 Bộ câu hỏi & Trả lời | Exploring Gender Roles: Expectations and Realities"',
    link: "az164-exploring-gender-roles-expectations-realities",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Generation Gap: "20 Bộ câu hỏi & Trả lời | Exploring the Generation Gap: Bridging Differences Across Ages"',
    link: "az165-exploring-generation-gap-bridging-differences-ages",
  },
  {
    root: "learninghub",
    preName: "",
    name: "Saint Patrick's Day: \"20 Bộ câu hỏi & Trả lời | Celebrating Saint Patrick's Day\"",
    link: "az166-celebrating-saint-patricks-day",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Understanding Homelessness: "20 Bộ câu hỏi & Trả lời | Understanding Homelessness: Challenges and Ways Forward"',
    link: "az167-understanding-homelessness",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Insights on Immigration: "20 Bộ câu hỏi & Trả lời | Comprehensive Insights on Immigration: Exploring Causes and Effects"',
    link: "az168-comprehensive-insights-on-immigration",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Impactful Inventions: "20 Bộ câu hỏi & Trả lời | The Most Impactful Inventions of Modern Times"',
    link: "az169-impactful-inventions-modern-times",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Job Interview Tips: "20 Bộ câu hỏi & Trả lời | Ace Your Job Interview: Proven Strategies and Tips"',
    link: "az170-ace-your-job-interview-strategies-tips",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Essence of Leadership: "20 Bộ câu hỏi & Trả lời | The Essence of Leadership: Key Traits, Challenges, and Strategies for Success"',
    link: "az171-essence-of-leadership-traits-challenges-strategies",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Role of Machines: "12 Bộ câu hỏi & Trả lời | How Machines Shape Our Daily Lives: Essential Insights"',
    link: "az172-how-machines-shape-our-lives",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Exploring Martial Arts: "20 Bộ câu hỏi & Trả lời | Exploring Martial Arts: History, Techniques, and Personal Growth"',
    link: "az173-exploring-martial-arts",
  },
  {
    root: "learninghub",
    preName: "",
    name: "Life's Purpose: \"20 Bộ câu hỏi & Trả lời | Discovering Life's Purpose: Insights on the Meaning of Life\"",
    link: "az174-discovering-meaning-of-life",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Midlife Crisis: "20 Bộ câu hỏi & Trả lời | Navigating a Midlife Crisis: Strategies for Positive Transformation"',
    link: "az175-navigating-midlife-crisis",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Movie Industry: "20 Bộ câu hỏi & Trả lời | Exploring the Movie Industry: Hollywood\'s Influence and Global Cinema Trends"',
    link: "az176-exploring-movie-industry",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'New Media: "20 Bộ câu hỏi & Trả lời | Understanding New Media: The Evolution and Impact of Digital Journalism"',
    link: "az177-understanding-new-media-digital-journalism",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'The Olympics: "20 Bộ câu hỏi & Trả lời | Exploring the Olympics: History, Favorite Sports, and Modern Issues"',
    link: "az178-exploring-olympics-history-favorite-sports-issues",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'World of Painting: "20 Bộ câu hỏi & Trả lời | Exploring the World of Painting: Famous Works and Personal Artistic Expression"',
    link: "az179-exploring-world-of-painting",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Importance of Photography: "20 Bộ câu hỏi & Trả lời | The Art and Importance of Photography: Capturing Life\'s Moments"',
    link: "az180-art-and-importance-of-photography",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Preventing Plagiarism: "20 Bộ câu hỏi & Trả lời | Understanding and Preventing Plagiarism: Protecting Original Work"',
    link: "az181-understanding-preventing-plagiarism",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Role of Police: "20 Bộ câu hỏi & Trả lời | The Crucial Role of Police: Ensuring Safety and Justice"',
    link: "az182-crucial-role-of-police",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Understanding Politics: "20 Bộ câu hỏi & Trả lời | Understanding Politics: How Political Systems Shape Our World"',
    link: "az183-understanding-politics",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Impact of Poverty: "20 Bộ câu hỏi & Trả lời | The Impact of Poverty and How We Can Address It"',
    link: "az184-understanding-poverty",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Prejudices: "20 Bộ câu hỏi & Trả lời | Exploring the Roots and Remedies of Prejudices"',
    link: "az185-understanding-prejudices",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Privacy in the Digital Age: "16 Bộ câu hỏi & Trả lời | The Importance of Privacy in the Digital Age"',
    link: "az186-understanding-privacy",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Race and Racism: "20 Bộ câu hỏi & Trả lời | Exploring Race and Combating Racism: Key Insights"',
    link: "az187-understanding-race-combating-racism",
  },
  {
    root: "learninghub",
    preName: "",
    name: "Religion's Influence: \"20 Bộ câu hỏi & Trả lời | Understanding Religion's Influence in Modern Life\"",
    link: "az188-exploring-role-religion-society",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Nursing Homes & Retirement: "20 Bộ câu hỏi & Trả lời | Understanding Nursing Homes & Retirement Communities"',
    link: "az189-nursing-homes-retirement-communities-guide",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Planning Retirement: "20 Bộ câu hỏi & Trả lời | Essential Guide to Planning Your Perfect Retirement"',
    link: "az190-planning-perfect-retirement-guide",
  },
  {
    root: "learninghub",
    preName: "",
    name: "Russia's Global Position: \"20 Bộ câu hỏi & Trả lời | Understanding Russia's Position in the Global Arena\"",
    link: "az191-russias-global-influence-future",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Science and Technology: "20 Bộ câu hỏi & Trả lời | Exploring the Impact of Science and Technology"',
    link: "az192-impact-of-science-and-technology",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Self-Employment: "20 Bộ câu hỏi & Trả lời | The Pros and Cons of Self-Employment: Navigating the Entrepreneurial Journey"',
    link: "az193-pros-and-cons-of-self-employment",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Service Industry: "20 Bộ câu hỏi & Trả lời | Understanding the Service Industry: Benefits, Challenges, and Trends"',
    link: "az194-understanding-service-industry-benefits-challenges-trends",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Impact of Smoking: "20 Bộ câu hỏi & Trả lời | The Impact of Smoking: Health, Society, and Policy"',
    link: "az195-impact-of-smoking",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Social Problems: "20 Bộ câu hỏi & Trả lời | Addressing Social Problems: Homelessness, Addiction, and Discrimination"',
    link: "az196-addressing-social-problems",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Standardized Exams: "20 Bộ câu hỏi & Trả lời | The Role and Impact of Standardized Exams in Education"',
    link: "az197-standardized-exams-impact",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Stereotypes: "20 Bộ câu hỏi & Trả lời | Understanding and Challenging Common Stereotypes"',
    link: "az198-understanding-challenging-stereotypes",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Superheroes in Comics: "20 Bộ câu hỏi & Trả lời | Exploring Superheroes in Comics"',
    link: "az199-exploring-superheroes-in-comics",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Supernatural Phenomena: "20 Bộ câu hỏi & Trả lời | Exploring Supernatural Phenomena and Ghosts"',
    link: "az200-exploring-supernatural-phenomena-and-ghosts",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Bullfighting: "20 Bộ câu hỏi & Trả lời | Exploring Bullfighting: History, Culture, and Controversy"',
    link: "az201-exploring-bullfighting",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Future of Cloning: "20 Bộ câu hỏi & Trả lời | The Future of Cloning: Ethical, Medical, and Agricultural Impacts"',
    link: "az202-understanding-cloning",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Cultural Shock in Canada: "20 Bộ câu hỏi & Trả lời | Navigating Cultural Shock: Insights and Adaptations in Canada"',
    link: "az203-cultural-shock-adaptation-canada",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Understanding Earthquakes: "20 Bộ câu hỏi & Trả lời | Understanding Earthquakes: Impact and Preparedness"',
    link: "az204-understanding-earthquakes-impact",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Successful Relocation: "20 Bộ câu hỏi & Trả lời | Successful Relocation: Tips for Moving to a New Country"',
    link: "az205-successful-relocation-tips",
  },
  {
    root: "learninghub",
    preName: "",
    name: 'Legacy of Pope John II: "20 Bộ câu hỏi & Trả lời | Exploring the Legacy of Pope John II: The Globetrotter Pope"',
    link: "az206-pope-john-ii-legacy",
  },
];
