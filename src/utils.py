from anki import version as anki_version

def get_point_version() -> int:
    return int(anki_version.split(".")[2])
