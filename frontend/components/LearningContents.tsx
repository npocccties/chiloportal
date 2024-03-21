import clsx from "clsx";
import Link from "next/link";
import { Config } from "schemas";

type Props = {
  className?: string;
  learningContents: Exclude<Config["learningContents"], undefined>;
};

export default function LearningContents(props: Props) {
  return (
    <ul className={clsx("space-y-4", props.className)}>
      {props.learningContents.map((learningContent, index) => (
        <li key={index}>
          <Link
            className="flex flex-col gap-4 border-l-4 border-gray-100 pl-4 text-sm hover:bg-gray-50 py-1 [&>span:first-child]:hover:underline"
            href={learningContent.url}
            target="_blank"
          >
            <span className="text-base font-bold text-gray-700">
              {learningContent.name}
            </span>
            <span className="text-gray-800">{learningContent.description}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
