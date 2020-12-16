#include <rapidjson/document.h>
#include <rapidjson/writer.h>
#include <rapidjson/stringbuffer.h>

namespace json = rapidjson;

int main(){
  char* lol = "{\n\n\
    \"hello\": \"world\",\
    \"t\": true ,\
    \"f\": false,\
    \"n\": null,\
    \"i\": 123,\
    \"pi\": 3.1416,\
    \"a\": [1, 2, 3, 4]\
}";
  return 0;
}
