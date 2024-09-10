import { JSX } from "react/jsx-runtime";

interface HeadersProps {
  name: string;
}

const Header = (props: HeadersProps) => {
  return <h1>{props.name}</h1>;
};
interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface Description extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends Description {
  kind: "basic";
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}

interface CoursePartBackground extends Description {
  backgroundMaterial: string;
  kind: "background";
}

interface CoursePartSpecial extends Description {
  requirements: string[];
  kind: "special";
}

type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartSpecial;

interface ContentProps {
  courseParts: CoursePart[];
}

const Part = (props: ContentProps) => {
  const result: JSX.Element[] = [];
  props.courseParts.forEach((part) => {
    switch (part.kind) {
      case "basic":
        result.push(
          <div key={part.name}>
            <h4>
              <b>
                {part.name} {part.exerciseCount}
              </b>
            </h4>
            <p>
              <em>{part.description}</em>
            </p>
          </div>
        );
        break;
      case "group":
        result.push(
          <div key={part.name}>
            <h4>
              <b>
                {part.name} {part.exerciseCount}
              </b>
            </h4>
            <p>project exercises {part.groupProjectCount}</p>
          </div>
        );
        break;
      case "background":
        result.push(
          <div key={part.name}>
            <h4>
              <b>
                {part.name} {part.exerciseCount}
              </b>
            </h4>
            <p>
              <em>{part.description}</em>
            </p>
            <p>submit to {part.backgroundMaterial}</p>
          </div>
        );
        break;
      case "special":
        result.push(
          <div key={part.name}>
            <h4>
              <b>
                {part.name} {part.exerciseCount}
              </b>
            </h4>
            <p>
              <em>{part.description}</em>
            </p>
            <p>requerid skill: {part.requirements}</p>
          </div>
        );
        break;
      default: {
        const _exhaustiveCheck: never = part;
        console.log(_exhaustiveCheck);
        break;
      }
    }
  });
  return result;
};

const Content = (props: ContentProps) => {
  return (
    <div>
      <Part courseParts={props.courseParts} />
    </div>
  );
};

interface TotalProps {
  totalExercises: number;
}

const Total = (props: TotalProps) => {
  return <p>Number of exercises {props.totalExercises}</p>;
};

const App = () => {
  const courseName = "Half Stack application development";

  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic",
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group",
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic",
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial:
        "https://type-level-typescript.com/template-literal-types",
      kind: "background",
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special",
    },
  ];

  const totalExercises = courseParts.reduce(
    (sum, part) => sum + part.exerciseCount,
    0
  );

  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total totalExercises={totalExercises} />
    </div>
  );
};

export default App;
