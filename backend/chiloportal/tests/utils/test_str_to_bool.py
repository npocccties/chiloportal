from django.test import SimpleTestCase

from chiloportal.utils import str_to_bool


class StrToBoolTests(SimpleTestCase):
    def test_true_values(self):
        for value in ["y", "yes", "t", "true", "on", "1", "True", "TRUE", " true "]:
            with self.subTest(value=value):
                self.assertIs(str_to_bool(value), True)

    def test_false_values(self):
        for value in ["n", "no", "f", "false", "off", "0", "False", "FALSE"]:
            with self.subTest(value=value):
                self.assertIs(str_to_bool(value), False)

    def test_invalid_value(self):
        for value in ["", "2", "maybe"]:
            with self.subTest(value=value):
                with self.assertRaises(ValueError):
                    str_to_bool(value)
