import clsx from "clsx";
import { FieldDetail } from "api/@types";
import { makeFieldId } from "lib/field";

function FieldLink({ name, id }: { name: string; id: string }) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const element = document.querySelector(
      `#${CSS.escape(decodeURIComponent(id))}`
    );
    element?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <a href={`#${encodeURIComponent(id)}`} onClick={handleClick}>
      {name}
    </a>
  );
}

type Props = {
  className?: string;
  field: FieldDetail;
};

function FieldsIndex({ className, field }: Props) {
  return (
    <ul className={clsx("list-disc pl-4", className)}>
      {field.field1.map(({ field1_name, field2 }, field1Index) => (
        <li key={field1Index}>
          <FieldLink
            name={field1_name}
            id={makeFieldId(field1_name, field1Index)}
          />
          <ul className="list-disc pl-4">
            {field2.map(({ field2_name, field3 }, field2Index) => (
              <li key={field2Index}>
                <FieldLink
                  name={field2_name}
                  id={makeFieldId(field2_name, field1Index, field2Index)}
                />
                <ul className="list-disc pl-4">
                  {field3.map(({ field_id, field3_name }, field3Index) => (
                    <li key={field_id}>
                      <FieldLink
                        name={field3_name}
                        id={makeFieldId(
                          field3_name,
                          field1Index,
                          field2Index,
                          field3Index
                        )}
                      />
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export default FieldsIndex;
